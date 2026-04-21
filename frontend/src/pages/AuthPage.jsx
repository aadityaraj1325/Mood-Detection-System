import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NeuralNetworkHero from '../components/ui/NeuralNetworkHero';

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

const featurePills = ['AI Mood Detection', 'Personalized Insights', '100% Private'];

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
    <div className="min-h-screen p-4 lg:p-6">
      <div className="grid min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-2">
        <div className="hidden lg:block">
          <NeuralNetworkHero />
        </div>

        <div className="flex items-center justify-center">
          <div className="glass-card w-full max-w-lg p-7">
            <p className="text-xs uppercase tracking-[0.3em] text-neural-300/80">PulseMind AI</p>
            <h1 className="font-display mt-3 text-3xl font-semibold text-text-primary">
              AI-powered mental wellness platform for higher education.
            </h1>

            <div className="mt-4 hidden flex-wrap gap-2 lg:flex">
              {featurePills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-border-glass bg-glass-ultra px-3 py-1 text-xs text-text-primary"
                >
                  {pill}
                </span>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
              >
                <label className="block text-sm text-text-secondary">
                  <span className="mb-1 block">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </label>

                {!isLogin && (
                  <label className="block text-sm text-text-secondary">
                    <span className="mb-1 block">Full Name</span>
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </label>
                )}

                <label className="block text-sm text-text-secondary">
                  <span className="mb-1 block">Password</span>
                  <input
                    name="password"
                    type="password"
                    minLength={8}
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </label>

                {error ? (
                  <div className="rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                    {error}
                  </div>
                ) : null}

                <button className="btn-primary w-full" disabled={loading} type="submit">
                  {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
                </button>
              </motion.form>
            </AnimatePresence>

            <button
              className="mt-4 text-sm text-serenity-500 transition hover:text-serenity-400"
              onClick={() => setIsLogin((prev) => !prev)}
              type="button"
            >
              {isLogin ? 'Create a new account' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
