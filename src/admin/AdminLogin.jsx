import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/supabase';
import './Admin.css';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin/gallery');
    } catch (err) {
      setError(err.message || 'Login gagal');
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
          <label className="admin-label">Email</label>
          <input
            className="admin-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
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
