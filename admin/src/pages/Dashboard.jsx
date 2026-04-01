import React, { useEffect, useState } from 'react';
import { Users, FileText, Activity, TrendingDown } from 'lucide-react';
import { api } from '../api/client';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-slate-100 mb-0.5">{value ?? '—'}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.stats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: Users,       label: 'Всього юзерів',    value: stats?.totalUsers,     color: 'bg-indigo-600/20 text-indigo-400' },
    { icon: FileText,    label: 'Записів у журналі', value: stats?.totalLogs,      color: 'bg-emerald-600/20 text-emerald-400' },
    { icon: Activity,    label: 'Активні сьогодні',  value: stats?.activeToday,    color: 'bg-amber-600/20 text-amber-400' },
    { icon: TrendingDown,label: 'Знижено ваги (кг)',  value: stats?.totalWeightLost, color: 'bg-rose-600/20 text-rose-400' },
  ];

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-slate-100">Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">Загальна статистика проекту</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <div className="w-4 h-4 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
          Завантаження...
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => <StatCard key={c.label} {...c} />)}
        </div>
      )}

      {stats && (
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Середні показники</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xl font-bold text-slate-100">{stats.avgWeightLost} кг</p>
              <p className="text-xs text-slate-500">Середнє схуднення на юзера</p>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-100">
                {stats.totalUsers > 0 ? (stats.totalLogs / stats.totalUsers).toFixed(1) : 0}
              </p>
              <p className="text-xs text-slate-500">Середня кількість записів</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
