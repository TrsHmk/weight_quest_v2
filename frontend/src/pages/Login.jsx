import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { checkAppState } = useAuth();

  const from = new URLSearchParams(window.location.search).get('from') || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await base44.auth.login(email, password);
      await checkAppState();
      window.location.href = from;
    } catch (err) {
      setError(err.message || 'Помилка входу');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await base44.auth.register(email, password, username);
      await checkAppState();
      window.location.href = from;
    } catch (err) {
      setError(err.message || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="text-2xl mb-2">⚔️</div>
          <h1 className="font-mono text-sm font-bold tracking-widest text-primary uppercase">Weight Quest</h1>
          <p className="text-xs text-muted-foreground">Твій особистий RPG-квест для схуднення</p>
        </div>

        <div className="flex rounded-lg bg-secondary p-1 gap-1">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                tab === t
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'login' ? 'Вхід' : 'Реєстрація'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Завантаження...' : 'УВІЙТИ ▶'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Ім&apos;я</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Taras"
                required
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="мін. 6 символів"
                minLength={6}
                required
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Завантаження...' : 'ЗАРЕЄСТРУВАТИСЬ ▶'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
