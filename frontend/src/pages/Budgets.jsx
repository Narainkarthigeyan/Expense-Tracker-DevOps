import { useEffect, useState } from 'react';
import { getBudgets, createBudget, deleteBudget, getExpenses } from '../api';
import { Plus, Trash2, PiggyBank, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: '', budgetLimit: '' });
  const [showForm, setShowForm] = useState(false);
  const userId = localStorage.getItem('userId');

  const fetchData = () => {
    getBudgets(userId).then(res => setBudgets(res.data)).catch(console.error);
    getExpenses(userId).then(res => setExpenses(res.data)).catch(console.error);
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBudget({ ...form, userId, budgetLimit: parseFloat(form.budgetLimit) });
    setForm({ category: '', budgetLimit: '' });
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this budget?')) {
      await deleteBudget(id);
      fetchData();
    }
  };

  // Compute actual spending per category from expenses
  const spendingByCategory = expenses.reduce((acc, exp) => {
    const cat = (exp.category || '').toLowerCase().trim();
    acc[cat] = (acc[cat] || 0) + (exp.amount || 0);
    return acc;
  }, {});

  const getSpentForBudget = (budget) => {
    const cat = (budget.category || '').toLowerCase().trim();
    return spendingByCategory[cat] || 0;
  };

  const getProgress = (spent, limit) => {
    if (!limit || limit === 0) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const getProgressClass = (spent, limit) => {
    const pct = getProgress(spent, limit);
    if (pct >= 90) return 'danger';
    if (pct >= 60) return 'warning';
    return 'safe';
  };

  const totalBudget = budgets.reduce((s, b) => s + (b.budgetLimit || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + getSpentForBudget(b), 0);

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Budgets</h1>
          <p className="subtitle">Set and track spending limits by category</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Create Budget
        </button>
      </div>

      {/* Stats */}
      <div className="grid-3 mb-2">
        <div className="stat-card primary">
          <p className="stat-label">Total Budget</p>
          <p className="stat-value">₹{totalBudget.toFixed(2)}</p>
        </div>
        <div className="stat-card emerald">
          <p className="stat-label">Total Spent</p>
          <p className="stat-value">₹{totalSpent.toFixed(2)}</p>
        </div>
        <div className="stat-card amber">
          <p className="stat-label">Remaining</p>
          <p className="stat-value">₹{(totalBudget - totalSpent).toFixed(2)}</p>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="form-card animate-in">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '1.25rem' }}>
            <PiggyBank size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            New Budget
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Cloud Infrastructure" />
              </div>
              <div className="form-group">
                <label>Budget Limit (₹)</label>
                <input required type="number" step="0.01" min="0" value={form.budgetLimit} onChange={e => setForm({ ...form, budgetLimit: e.target.value })} placeholder="0.00" />
              </div>
              <button className="btn-primary" type="submit" style={{ alignSelf: 'flex-end' }}>
                <Plus size={16} /> Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Cards */}
      {budgets.length > 0 ? (
        <div className="budget-grid">
          {budgets.map(b => {
            const spent = getSpentForBudget(b);
            const limit = b.budgetLimit || 0;
            const remaining = limit - spent;
            const pct = getProgress(spent, limit);
            const cls = getProgressClass(spent, limit);
            return (
              <div className="budget-card" key={b.id}>
                <div className="budget-header">
                  <span className="budget-category">{b.category}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {cls === 'danger' && <AlertTriangle size={16} color="var(--danger)" />}
                    {cls === 'safe' && <CheckCircle size={16} color="var(--success)" />}
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(b.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="budget-amounts">
                  <span>Spent: <span className="amount">₹{spent.toFixed(2)}</span></span>
                  <span>Limit: <span className="amount">₹{limit.toFixed(2)}</span></span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${cls}`} style={{ width: `${pct}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span className={`budget-remaining ${remaining < 0 ? 'over' : ''}`}>
                    {remaining >= 0 ? `₹${remaining.toFixed(2)} remaining` : `₹${Math.abs(remaining).toFixed(2)} over budget`}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {pct.toFixed(0)}% used
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon"><PiggyBank size={28} /></div>
            <p>No budgets created yet. Click "Create Budget" to set spending limits.</p>
          </div>
        </div>
      )}
    </div>
  );
}
