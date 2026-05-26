import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, PiggyBank, BarChart3, LogOut, TrendingUp, Sun, Moon, ArrowLeftRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <TrendingUp size={20} />
        </div>
        FinOps AI
      </div>

      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/expenses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Receipt size={20} /> Expenses
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <ArrowLeftRight size={20} /> Transactions
        </NavLink>
        <NavLink to="/budgets" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <PiggyBank size={20} /> Budgets
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <BarChart3 size={20} /> Analytics
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Signed in as</p>
          <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>{username}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
