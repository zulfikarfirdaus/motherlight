import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../hooks/useAdmin';
import './Admin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login gagal'); return; }
      setToken(data.token);
      navigate('/admin/gallery');
    } catch {
      setError('Tidak dapat terhubung ke server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-root admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-logo">Motherlight</div>
        <div className="admin-login-sub">Panel Admin</div>

        {error && <div className="admin-login-error">{error}</div>}

        <div className="admin-field">
          <label className="admin-label">Username</label>
          <input
            className="admin-input"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="admin-field">
          <label className="admin-label">Password</label>
          <input
            className="admin-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn-admin btn-admin-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          disabled={loading}
        >
          {loading ? 'Masuk…' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
