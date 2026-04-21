import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;

  if (!detail) return 'Authentication failed';
  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item.msg === 'string') return item.msg;
        return null;
      })
      .filter(Boolean)
      .join(', ') || 'Authentication failed';
  }

  if (typeof detail === 'object' && typeof detail.msg === 'string') {
    return detail.msg;
  }

  return 'Authentication failed';
}

function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', full_name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
        await login({ email: form.email, password: form.password });
      }
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass neo-border w-full max-w-lg rounded-3xl p-7">
        <h1 className="font-display text-3xl font-semibold text-slate-100">PulseMind AI</h1>
        <p className="mt-2 text-sm text-slate-400">AI-powered mental wellness platform for higher education.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm text-slate-200">
            <span className="mb-1 block">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-300/45"
            />
          </label>

          {!isLogin && (
            <label className="block text-sm text-slate-200">
              <span className="mb-1 block">Full Name</span>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-300/45"
              />
            </label>
          )}

          <label className="block text-sm text-slate-200">
            <span className="mb-1 block">Password</span>
            <input
              name="password"
              type="password"
              minLength={8}
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-300/45"
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            className="ripple-btn w-full rounded-xl border border-cyan-300/40 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/30"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <button
          className="mt-4 text-sm text-teal-300 transition hover:text-teal-200"
          onClick={() => setIsLogin((prev) => !prev)}
          type="button"
        >
          {isLogin ? 'Create a new account' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
