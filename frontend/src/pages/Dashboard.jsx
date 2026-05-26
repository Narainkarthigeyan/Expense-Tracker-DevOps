import { useEffect, useState } from 'react';
import { getAnalytics, getExpenses, getMonthlySummary } from '../api';
import { IndianRupee, TrendingUp, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({ totalExpenses: 0, transactionCount: 0, categoryBreakdown: {} });
  const [expenses, setExpenses] = useState([]);
  const [monthly, setMonthly] = useState({});
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username') || 'User';

  useEffect(() => {
    if (userId) {
      getAnalytics(userId).then(res => setAnalytics(res.data)).catch(console.error);
      getExpenses(userId).then(res => setExpenses(res.data)).catch(console.error);
      getMonthlySummary(userId).then(res => setMonthly(res.data.monthlyBreakdown || {})).catch(console.error);
    }
  }, [userId]);

  const pieData = Object.entries(analytics.categoryBreakdown || {}).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(monthly).sort().map(([month, amount]) => ({ month, amount }));
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)).slice(0, 5);

  const avgExpense = analytics.transactionCount > 0
    ? (analytics.totalExpenses / analytics.transactionCount).toFixed(2)
    : '0.00';

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Welcome back, {username} 👋</h1>
          <p className="subtitle">Here's your financial overview</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4 mb-3">
        <div className="stat-card primary">
          <div className="stat-icon"><IndianRupee size={22} /></div>
          <p className="stat-label">Total Expenses</p>
          <p className="stat-value">₹{(analytics.totalExpenses || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="stat-card emerald">
          <div className="stat-icon"><CreditCard size={22} /></div>
          <p className="stat-label">Transactions</p>
          <p className="stat-value">{analytics.transactionCount || 0}</p>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon"><TrendingUp size={22} /></div>
          <p className="stat-label">Avg. Transaction</p>
          <p className="stat-value">₹{avgExpense}</p>
        </div>
        <div className="stat-card rose">
          <div className="stat-icon"><Activity size={22} /></div>
          <p className="stat-label">Categories</p>
          <p className="stat-value">{Object.keys(analytics.categoryBreakdown || {}).length}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2 mb-3">
        <div className="chart-card">
          <p className="chart-title">Monthly Spending</p>
          <div style={{ height: '280px' }}>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#6b7a90" fontSize={12} />
                  <YAxis stroke="#6b7a90" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--tooltip-text)' }}
                    formatter={(v) => [`₹${v.toFixed(2)}`, 'Amount']}
                  />
                  <Bar dataKey="amount" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No monthly data yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <p className="chart-title">Category Distribution</p>
          <div style={{ height: '280px' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--tooltip-text)' }}
                    formatter={(v) => `₹${v.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No category data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="table-wrapper">
        <div className="table-header">
          <h3>Recent Transactions</h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Last {recentExpenses.length} transactions</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentExpenses.map(exp => (
              <tr key={exp.id}>
                <td style={{ color: 'var(--text-secondary)' }}>{exp.transactionDate}</td>
                <td><span className="badge badge-primary">{exp.category}</span></td>
                <td>{exp.description}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-rose)' }}>
                  <ArrowDownRight size={14} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                  ₹{Number(exp.amount).toFixed(2)}
                </td>
              </tr>
            ))}
            {recentExpenses.length === 0 && (
              <tr><td colSpan="4" className="empty-state">No transactions yet. Add some expenses to get started!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
