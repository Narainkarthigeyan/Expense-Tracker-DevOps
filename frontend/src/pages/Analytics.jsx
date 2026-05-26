import { useEffect, useState } from 'react';
import { getAnalytics, getMonthlySummary } from '../api';
import { BarChart3, TrendingUp, PieChart as PieIcon, IndianRupee } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [monthly, setMonthly] = useState({});
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      getAnalytics(userId).then(res => setAnalytics(res.data)).catch(console.error);
      getMonthlySummary(userId).then(res => setMonthly(res.data.monthlyBreakdown || {})).catch(console.error);
    }
  }, [userId]);

  if (!analytics) {
    return <div className="loading"><div className="spinner"></div>Loading analytics...</div>;
  }

  const pieData = Object.entries(analytics.categoryBreakdown || {}).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(analytics.categoryBreakdown || {}).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const areaData = Object.entries(monthly).sort().map(([month, amount]) => ({ month, amount }));

  const topCategory = barData.length > 0 ? barData[0] : null;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="subtitle">Insights and trends for your spending</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4 mb-3">
        <div className="stat-card primary">
          <div className="stat-icon"><IndianRupee size={22} /></div>
          <p className="stat-label">Total Analyzed</p>
          <p className="stat-value">₹{(analytics.totalExpenses || 0).toFixed(2)}</p>
        </div>
        <div className="stat-card emerald">
          <div className="stat-icon"><BarChart3 size={22} /></div>
          <p className="stat-label">Transactions</p>
          <p className="stat-value">{analytics.transactionCount || 0}</p>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon"><PieIcon size={22} /></div>
          <p className="stat-label">Categories</p>
          <p className="stat-value">{pieData.length}</p>
        </div>
        <div className="stat-card rose">
          <div className="stat-icon"><TrendingUp size={22} /></div>
          <p className="stat-label">Top Category</p>
          <p className="stat-value" style={{ fontSize: '1.1rem' }}>{topCategory ? topCategory.name : 'N/A'}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2 mb-3">
        {/* Pie Chart */}
        <div className="chart-card">
          <p className="chart-title">Expense Distribution</p>
          <div style={{ height: '320px' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--tooltip-text)' }}
                    formatter={(v) => `₹${v.toFixed(2)}`}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '0.82rem', color: '#a0aec0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No expense data available</p></div>
            )}
          </div>
        </div>

        {/* Bar Chart - Category Comparison */}
        <div className="chart-card">
          <p className="chart-title">Category Comparison</p>
          <div style={{ height: '320px' }}>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="#6b7a90" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#6b7a90" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--tooltip-text)' }}
                    formatter={(v) => [`₹${v.toFixed(2)}`, 'Amount']}
                  />
                  <Bar dataKey="value" fill="url(#catGradient)" radius={[0, 6, 6, 0]} />
                  <defs>
                    <linearGradient id="catGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No category data available</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="chart-card mb-3">
        <p className="chart-title">Monthly Spending Trend</p>
        <div style={{ height: '300px' }}>
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#6b7a90" fontSize={12} />
                <YAxis stroke="#6b7a90" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--tooltip-text)' }}
                  formatter={(v) => [`₹${v.toFixed(2)}`, 'Spending']}
                />
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fill="url(#areaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>No monthly data available</p></div>
          )}
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="table-wrapper">
        <div className="table-header">
          <h3>Category Breakdown</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Percentage</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {barData.map((item, i) => {
              const pct = analytics.totalExpenses > 0 ? ((item.value / analytics.totalExpenses) * 100) : 0;
              return (
                <tr key={item.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                      {item.name}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{item.value.toFixed(2)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{pct.toFixed(1)}%</td>
                  <td style={{ width: '30%' }}>
                    <div className="progress-bar" style={{ height: '6px' }}>
                      <div className="progress-fill safe" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
