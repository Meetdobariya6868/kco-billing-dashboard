import React from 'react';

export default function DetailModal({ open, onClose, row }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Entry detail</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {row ? (
          <div className="modal-body">
            <div className="detail-grid">
              <div><strong>ID</strong><div className="muted">{row.id}</div></div>
              <div><strong>Date</strong><div className="muted">{row.date}</div></div>
              <div><strong>Cloud</strong><div>{row.cloud}</div></div>
              <div><strong>Service</strong><div>{row.service}</div></div>
              <div><strong>Team</strong><div>{row.team}</div></div>
              <div><strong>Env</strong><div>{row.env}</div></div>
              <div><strong>Cost</strong><div>${Number(row.cost).toFixed(2)}</div></div>
            </div>

            <div className="explain" style={{marginTop:12, color:'#334155', fontSize:14}}>
              {`This is ${row.cloud} ${row.service} spend from the ${row.team} team in ${row.env}.`}
            </div>
          </div>
        ) : (
          <div className="modal-body">No data</div>
        )}
      </div>
    </div>
  );
}
