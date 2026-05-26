import { useEffect, useState } from 'react';
import { getExpenses } from '../api';
import { ArrowDownRight, Search, Filter } from 'lucide-react';

const BADGE_COLORS = ['badge-primary', 'badge-emerald', 'badge-amber', 'badge-rose', 'badge-violet', 'badge-cyan'];

export default function Transactions() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      getExpenses(userId)
        .then(res => { setExpenses(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [userId]);

  const categories = [...new Set(expenses.map(e => e.category))].sort();

  const filtered = expenses
    .filter(e => {
      const matchesSearch = !search ||
        (e.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.category || '').toLowerCase().includes(search.toLowerCase());
      const matchesCat = !categoryFilter || e.category === categoryFilter;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

  const totalAmount = filtered.reduce((sum, e) => sum + (e.amount || 0), 0);

  const getCategoryBadge = (category) => {
    const hash = category.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return BADGE_COLORS[hash % BADGE_COLORS.length];
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div>Loading transactions...</div>;
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p className="subtitle">Complete history of all your transactions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3 mb-2">
        <div className="stat-card primary">
          <p className="stat-label">Total Transactions</p>
          <p className="stat-value">{filtered.length}</p>
        </div>
        <div className="stat-card emerald">
          <p className="stat-label">Total Amount</p>
          <p className="stat-value">₹{totalAmount.toFixed(2)}</p>
        </div>
        <div className="stat-card amber">
          <p className="stat-label">Categories</p>
          <p className="stat-value">{categories.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="form-card mb-2" style={{ padding: '1rem 1.5rem' }}>
        <div className="form-row" style={{ alignItems: 'center' }}>
          <div className="form-group" style={{ flex: 2 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by description or category..."
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <Filter size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="table-wrapper">
        <div className="table-header">
          <h3>All Transactions</h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {filtered.length} of {expenses.length} records
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((exp, idx) => (
              <tr key={exp.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{idx + 1}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{exp.transactionDate}</td>
                <td><span className={`badge ${getCategoryBadge(exp.category)}`}>{exp.category}</span></td>
                <td>{exp.description}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-rose)' }}>
                  <ArrowDownRight size={14} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                  ₹{Number(exp.amount).toFixed(2)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <p>{search || categoryFilter ? 'No transactions match your filters.' : 'No transactions recorded yet.'}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
