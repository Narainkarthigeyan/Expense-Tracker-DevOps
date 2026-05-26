import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';
import { TrendingUp, Mail, Lock, User } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await login(formData);
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('username', data.username);
          navigate('/');
        } else {
          setError(data.error || 'Invalid credentials');
        }
      } else {
        await register(formData);
        setIsLogin(true);
        setError('');
        setFormData({ ...formData, password: '' });
        alert('Account created successfully! Please sign in.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-in">
        <div className="login-header">
          <div className="login-logo">
            <TrendingUp size={28} />
          </div>
          <h1>FinOps AI</h1>
          <p className="login-subtitle">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><User size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />Username</label>
            <input
              required
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label><Mail size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />Email</label>
              <input
                required
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label><Lock size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />Password</label>
            <input
              required
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button className="btn-primary login-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="login-toggle">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
}
