import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, RotateCcw, Plus, X, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { api } from '../api/client';

const LEVELS = ['', 'Новобранець', 'Воїн', 'Лицар', 'Паладін', 'Чемпіон', 'Герой', 'Легенда'];

function Stat({ label, value, sub }) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-4">
      <p className="text-xl font-bold text-slate-100">{value ?? '—'}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-emerald-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function PenaltyBadge({ zone }) {
  if (!zone || zone === 'none') return <span className="text-xs text-emerald-400">✓ норма</span>;
  if (zone === 'yellow') return <span className="text-xs text-amber-400">⚠ жовта зона</span>;
  return <span className="text-xs text-red-400">🔴 червона зона</span>;
}

function DangerBtn({ onClick, children, small }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-red-400 border border-red-900/60 rounded-lg hover:bg-red-900/20 transition-colors ${small ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs'}`}
    >
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
    >
      {children}
    </button>
  );
}

function EditableCell({ value, onSave, step, suffix = '' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  function startEdit() {
    setDraft(String(value));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commit() {
    const parsed = step === 1 ? parseInt(draft) : parseFloat(draft);
    if (!isNaN(parsed) && parsed !== value) onSave(parsed);
    setEditing(false);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        step={step}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        className="w-20 bg-slate-700 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-slate-100 outline-none"
        autoFocus
      />
    );
  }

  return (
    <button
      onClick={startEdit}
      className="flex items-center gap-1 group/cell hover:text-indigo-300 transition-colors"
      title="Клікни щоб редагувати"
    >
      <span>{value}{suffix}</span>
      <Pencil className="w-3 h-3 opacity-0 group-hover/cell:opacity-60 transition-opacity" />
    </button>
  );
}

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [busy, setBusy]         = useState(false);
  const [addArtId, setAddArtId] = useState('');
  const [showAddArt, setShowAddArt] = useState(false);

  const reload = () => {
    setLoading(true);
    api.admin.user(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, [id]);

  async function act(fn, confirmMsg) {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(true);
    try { await fn(); reload(); }
    catch (e) { alert(e.message); }
    finally { setBusy(false); }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-slate-500 text-sm">
        <div className="w-4 h-4 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
        Завантаження...
      </div>
    );
  }

  if (!data) return <div className="p-6 text-slate-400">Юзера не знайдено.</div>;

  const { user, profile, logs, inventory = [] } = data;
  const chartData = [...logs].reverse().map(l => ({ date: l.date, weight: parseFloat(l.weight) }));
  const weightLost = profile ? parseFloat(profile.start_weight) - parseFloat(profile.current_weight) : 0;

  return (
    <div className="p-6 max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/users')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Назад
        </button>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">{user.username}</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
          <p className="text-xs text-slate-600 mt-0.5">Реєстрація: {format(new Date(user.created_at), 'dd.MM.yyyy')}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-right">
            <p className="text-sm font-semibold text-indigo-400">
              Lvl {profile?.current_level ?? 1} — {LEVELS[profile?.current_level] ?? 'Новобранець'}
            </p>
            <PenaltyBadge zone={profile?.penalty_zone} />
          </div>
          <GhostBtn onClick={() => act(() => api.admin.resetSteps(id), `Скинути кроки для ${user.username}?`)}>
            <RotateCcw className="w-3.5 h-3.5" /> Кроки
          </GhostBtn>
          <GhostBtn onClick={() => act(() => api.admin.resetWeight(id), `Скинути вагу до старту для ${user.username}?`)}>
            <RotateCcw className="w-3.5 h-3.5" /> Вага
          </GhostBtn>
          <DangerBtn
            onClick={() => act(() => api.admin.resetUser(id), `Повністю скинути ${user.username}? Це видалить всі логи, інвентар та квести.`)}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Скинути все
          </DangerBtn>
        </div>
      </div>

      {/* Stats */}
      {profile && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Поточна вага" value={`${profile.current_weight} кг`}
            sub={weightLost > 0 ? `−${weightLost.toFixed(1)} кг` : null} />
          <Stat label="Старт" value={`${profile.start_weight} кг`} />
          <Stat label="Всього XP" value={profile.total_xp} />
          <Stat label="Найкращий стрік" value={`${profile.best_streak}д`} />
          <Stat label="Кроків всього" value={(profile.total_steps || 0).toLocaleString()} />
          <Stat label="Заощаджено" value={`₴${parseFloat(profile.total_money_saved || 0).toFixed(0)}`} />
          <Stat label="Мілстоунів" value={`${profile.unlocked_milestones?.length ?? 0}/16`} />
          <Stat label="Ачівок" value={`${profile.unlocked_achievements?.length ?? 0}/6`} />
        </div>
      )}

      {/* Weight chart */}
      {chartData.length > 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Графік ваги ({logs.length} записів)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={d => format(new Date(d + 'T00:00:00'), 'dd.MM')} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748b' }} width={36} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
                labelFormatter={d => format(new Date(d + 'T00:00:00'), 'dd.MM.yyyy')}
                formatter={v => [`${v} кг`, 'Вага']}
              />
              {profile?.lowest_weight && (
                <ReferenceLine y={parseFloat(profile.lowest_weight)} stroke="#10b981" strokeDasharray="4 4" />
              )}
              <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2}
                dot={{ r: 3, fill: '#6366f1' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Logs table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Записи ({logs.length})
          </p>
          {logs.length > 0 && (
            <DangerBtn small onClick={() => act(() => api.admin.clearLogs(id), 'Видалити всі записи ваги?')}>
              <Trash2 className="w-3 h-3" /> Всі
            </DangerBtn>
          )}
        </div>
        {logs.length === 0
          ? <p className="px-5 py-4 text-xs text-slate-600">Записів немає.</p>
          : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Дата', 'Вага', 'Кроки', 'XP', 'Зона', 'Події', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 group">
                    <td className="px-4 py-2.5 text-slate-400 text-xs font-mono">
                      {format(new Date(log.date + 'T00:00:00'), 'dd.MM.yyyy')}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-200">
                      <EditableCell
                        value={parseFloat(log.weight)}
                        step={0.1}
                        suffix=" кг"
                        onSave={val => act(() => api.admin.updateLog(id, log.id, { weight: val }))}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">
                      <EditableCell
                        value={log.steps || 0}
                        step={1}
                        onSave={val => act(() => api.admin.updateLog(id, log.id, { steps: val }))}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      {log.xp_earned > 0 && <span className="text-xs text-indigo-400">+{log.xp_earned}</span>}
                    </td>
                    <td className="px-4 py-2.5"><PenaltyBadge zone={log.penalty_zone} /></td>
                    <td className="px-4 py-2.5 text-xs text-slate-500 max-w-[180px] truncate">
                      {log.events?.join(' · ') || '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => act(() => api.admin.deleteLog(id, log.id))}
                        className="opacity-0 group-hover:opacity-100 text-red-500/70 hover:text-red-400 transition-all"
                        disabled={busy}
                        title="Видалити запис"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

      {/* Inventory */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Інвентар ({inventory.length})
          </p>
          <div className="flex items-center gap-2">
            <GhostBtn onClick={() => setShowAddArt(v => !v)}>
              <Plus className="w-3.5 h-3.5" /> Додати
            </GhostBtn>
            {inventory.length > 0 && (
              <DangerBtn small onClick={() => act(() => api.admin.clearInventory(id), 'Очистити весь інвентар?')}>
                <Trash2 className="w-3 h-3" /> Всі
              </DangerBtn>
            )}
          </div>
        </div>

        {showAddArt && (
          <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2 bg-slate-800/40">
            <input
              value={addArtId}
              onChange={e => setAddArtId(e.target.value)}
              placeholder="artifact_id або chest_id (напр. gigachad_aura)"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500"
            />
            <GhostBtn onClick={() => {
              if (!addArtId.trim()) return;
              act(() => api.admin.addArtifact(id, addArtId.trim()));
              setAddArtId('');
              setShowAddArt(false);
            }}>
              Додати
            </GhostBtn>
          </div>
        )}

        {inventory.length === 0
          ? <p className="px-5 py-4 text-xs text-slate-600">Інвентар порожній.</p>
          : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['ID артефакту', 'Отримано', 'Стан', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 group">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-300">{item.artifact_id}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">
                      {format(new Date(item.acquired_at), 'dd.MM.yyyy HH:mm')}
                    </td>
                    <td className="px-4 py-2.5">
                      {item.used
                        ? <span className="text-xs text-slate-600">використано</span>
                        : <span className="text-xs text-emerald-500">активний</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => act(() => api.admin.deleteItem(id, item.id))}
                        className="opacity-0 group-hover:opacity-100 text-red-500/70 hover:text-red-400 transition-all"
                        disabled={busy}
                        title="Видалити"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

    </div>
  );
}
