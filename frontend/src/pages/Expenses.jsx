import { useEffect, useState } from 'react';
import { getExpenses, addExpense, deleteExpense } from '../api';
import { Plus, Trash2, Receipt, Calendar, Tag, FileText } from 'lucide-react';

const BADGE_COLORS = ['badge-primary', 'badge-emerald', 'badge-amber', 'badge-rose', 'badge-violet', 'badge-cyan'];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '', description: '', transactionDate: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  const fetchExpenses = () => {
    setLoading(true);
    getExpenses(userId)
      .then(res => { setExpenses(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (userId) fetchExpenses();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addExpense({ ...form, userId, amount: parseFloat(form.amount) });
    setForm({ category: '', amount: '', description: '', transactionDate: '' });
    setShowForm(false);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
      fetchExpenses();
    }
  };

  const getCategoryBadge = (category) => {
    const hash = category.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return BADGE_COLORS[hash % BADGE_COLORS.length];
  };

  const totalAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p className="subtitle">Manage and track your expenses</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid-3 mb-2">
        <div className="stat-card primary">
          <p className="stat-label">Total Spent</p>
          <p className="stat-value">₹{totalAmount.toFixed(2)}</p>
        </div>
        <div className="stat-card emerald">
          <p className="stat-label">Total Records</p>
          <p className="stat-value">{expenses.length}</p>
        </div>
        <div className="stat-card amber">
          <p className="stat-label">Categories</p>
          <p className="stat-value">{new Set(expenses.map(e => e.category)).size}</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="form-card animate-in">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '1.25rem' }}>
            <Plus size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            New Expense
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label><Tag size={12} style={{ marginRight: '0.3rem' }} />Category</label>
                <input required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Cloud Infrastructure" />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input required type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label><Calendar size={12} style={{ marginRight: '0.3rem' }} />Date</label>
                <input required type="date" value={form.transactionDate} onChange={e => setForm({ ...form, transactionDate: e.target.value })} />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label><FileText size={12} style={{ marginRight: '0.3rem' }} />Description</label>
                <input required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
              </div>
              <button className="btn-primary" type="submit" style={{ alignSelf: 'flex-end' }}>
                <Plus size={16} /> Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expense Table */}
      <div className="table-wrapper">
        <div className="table-header">
          <h3><Receipt size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Transaction History</h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{expenses.length} records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id}>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{exp.transactionDate}</td>
                <td><span className={`badge ${getCategoryBadge(exp.category)}`}>{exp.category}</span></td>
                <td>{exp.description}</td>
                <td style={{ fontWeight: 700 }}>₹{Number(exp.amount).toFixed(2)}</td>
                <td>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(exp.id)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && !loading && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="empty-icon"><Receipt size={28} /></div>
                    <p>No expenses recorded yet. Click "Add Expense" to get started.</p>
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
