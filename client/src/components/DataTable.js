import React from 'react';

function EmptyState({ loading }) {
  if (loading) return <div className="empty">Loading data…</div>;
  return <div className="empty">No data found for this filter.</div>;
}

export default function DataTable({ rows, loading, sortBy, setSortBy, onRowClick }) {
  const headers = [
    { key: 'date', label: 'Date' },
    { key: 'cloud', label: 'Cloud' },
    { key: 'service', label: 'Service' },
    { key: 'team', label: 'Team' },
    { key: 'env', label: 'Env' },
    { key: 'cost', label: 'Cost (USD)' }
  ];

  function onHeaderClick(key) {
    if (key !== 'date' && key !== 'cost') return;
    setSortBy(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  }

  return (
    <div className="data-table">
      <table className="table">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h.key} className="th">
                <button onClick={() => onHeaderClick(h.key)} className="th-btn">
                  <span>{h.label}</span>
                  {(h.key === 'date' || h.key === 'cost') && (
                    <span className="sort-indicator">{sortBy.key === h.key ? (sortBy.dir === 'asc' ? '▲' : '▼') : '↕'}</span>
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {(!rows || rows.length === 0) && (
            <tr><td colSpan={6}><EmptyState loading={loading} /></td></tr>
          )}

          {rows && rows.map(row => (
            <tr key={row.id} className="tr-row" onClick={() => onRowClick && onRowClick(row)} style={{cursor: 'pointer'}}>
              <td className="td">{row.date}</td>
              <td className="td cloud-cell">{row.cloud}</td>
              <td className="td">{row.service}</td>
              <td className="td">{row.team}</td>
              <td className="td">{row.env}</td>
              <td className="td cost-col">${Number(row.cost).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
