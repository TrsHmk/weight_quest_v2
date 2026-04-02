import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../api/client';

const LEVELS = ['', 'Новобранець', 'Воїн', 'Лицар', 'Паладін', 'Чемпіон', 'Герой', 'Легенда'];

function Badge({ zone }) {
  const map = { none: null, yellow: 'bg-amber-500/20 text-amber-400', red: 'bg-red-500/20 text-red-400' };
  if (!map[zone]) return null;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${map[zone]}`}>
      {zone === 'yellow' ? '⚠ yellow' : '🔴 red'}
    </span>
  );
}

export default function Users() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.admin.users(page)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-slate-100">Користувачі</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {data ? `${data.total} зареєстровано` : ''}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              {['Юзер', 'Рівень', 'Вага', 'XP', 'Стрік', 'Записів', 'Реєстрація', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-sm">Завантаження...</td></tr>
            ) : data?.users.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-sm">Немає юзерів</td></tr>
            ) : data?.users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-slate-800/50 hover:bg-slate-800/40 cursor-pointer transition-colors"
                onClick={() => navigate(`/users/${u.id}`)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-slate-200">{u.username}</p>
                    {u.is_admin && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold">ADMIN</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-300">{u.current_level ?? 1}</p>
                  <p className="text-xs text-slate-500">{LEVELS[u.current_level] || 'Новобранець'}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-300">{u.current_weight ? `${u.current_weight} кг` : '—'}</p>
                  {u.start_weight && u.current_weight && (
                    <p className="text-xs text-emerald-500">
                      −{(u.start_weight - u.current_weight).toFixed(1)} кг
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-300">{u.total_xp ?? 0}</td>
                <td className="px-4 py-3">
                  <span className="text-slate-300">{u.current_streak ?? 0}д</span>
                  <Badge zone={u.penalty_zone} />
                </td>
                <td className="px-4 py-3 text-slate-300">{u.log_count ?? 0}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {u.created_at ? format(new Date(u.created_at), 'dd.MM.yy') : '—'}
                </td>
                <td className="px-4 py-3">
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data && data.pages > 1 && (
          <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Сторінка {page} з {data.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors"
              >
                ← Назад
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors"
              >
                Далі →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
