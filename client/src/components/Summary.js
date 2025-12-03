import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4f46e5', '#06b6d4', '#f97316', '#10b981'];

export default function Summary({ rows }) {
  const totals = useMemo(() => {
    const total = (rows || []).reduce((s, r) => s + (Number(r.cost) || 0), 0);
    const byCloud = (rows || []).reduce((acc, r) => { acc[r.cloud] = (acc[r.cloud] || 0) + Number(r.cost); return acc; }, {});
    const chartData = Object.entries(byCloud).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));
    return { total, byCloud, chartData };
  }, [rows]);

  return (
    <div className="summary-card">
      <h3 className="summary-title">Summary (filtered)</h3>
      <div className="summary-total">${totals.total.toFixed(2)}</div>

      <div className="summary-content">
        <div className="summary-list">
          {Object.entries(totals.byCloud).length === 0 && <div className="muted">No spend in selected filters.</div>}
          {Object.entries(totals.byCloud).map(([cloud, amount], idx) => (
            <div key={cloud} className="summary-row">
              <div className="summary-label">
                <span className="legend-dot" style={{ background: COLORS[idx % COLORS.length] }} />
                {cloud}
              </div>
              <div className="summary-value">${amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="summary-chart">
          {totals.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={totals.chartData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={48} paddingAngle={4}>
                  {totals.chartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="muted">No chart data</div>
          )}
        </div>
      </div>
    </div>
  );
}
