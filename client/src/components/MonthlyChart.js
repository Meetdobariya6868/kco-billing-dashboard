import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { toMonthKey, monthLabel } from '../utils/dateUtils';

export default function MonthlyChart({ rows }) {
  const data = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    // aggregate by month (YYYY-MM)
    const agg = {};
    rows.forEach(r => {
      const key = toMonthKey(r.date);
      agg[key] = (agg[key] || 0) + Number(r.cost || 0);
    });
    // sort keys ascending and map
    return Object.keys(agg).sort().map(k => ({ month: monthLabel(k), value: Number(agg[k].toFixed(2)) }));
  }, [rows]);

  if (data.length === 0) return <div className="muted">No chart data</div>;

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v)=>`$${v}`} />
          <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
          <Bar dataKey="value" barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
