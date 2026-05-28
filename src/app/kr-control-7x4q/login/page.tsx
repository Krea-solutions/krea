'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      router.push('/kr-control-7x4q');
      router.refresh();
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#05090f' }}>
      <form onSubmit={submit} className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="font-serif text-3xl text-ink mb-2">KREA<span className="text-cyan">.</span></div>
          <div className="font-mono text-[11px] tracking-[0.16em] text-ink-mute uppercase">Internal · Restricted</div>
        </div>

        <div className="border border-line-strong rounded-2xl overflow-hidden" style={{ background: 'rgba(10,18,32,0.6)', backdropFilter: 'blur(20px)' }}>
          <label className="block p-7 border-b border-line">
            <div className="font-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">Username</div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              autoFocus
              className="w-full bg-transparent border-0 outline-none font-serif font-light text-2xl text-ink placeholder:text-ink-mute"
            />
          </label>
          <label className="block p-7">
            <div className="font-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-transparent border-0 outline-none font-serif font-light text-2xl text-ink placeholder:text-ink-mute"
            />
          </label>
        </div>

        {error && <div className="mt-4 text-sm text-accent font-mono">⚠ {error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-4 rounded-full bg-cyan text-bg font-medium text-sm tracking-wide hover:bg-glow transition-colors disabled:opacity-50"
        >
          {loading ? 'Authenticating…' : 'Authenticate'}
        </button>

        <a href="/" className="block text-center mt-8 font-mono text-[11px] text-ink-mute tracking-wide hover:text-ink-dim">
          ← Return to site
        </a>
      </form>
    </div>
  );
}
