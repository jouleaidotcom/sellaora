import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, setAuthToken } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login(formData);

      if (response.success && response.data.token) {
        setAuthToken(response.data.token);
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Top brand */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold tracking-tight">JouleAI</span>
        </a>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
              <p className="mt-2 text-neutral-300">Sign in to your JouleAI account</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-neutral-300">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/40"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm text-neutral-300">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/40"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-400">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-emerald-400 hover:text-emerald-300">Create one</Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-neutral-400 hover:text-white">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
