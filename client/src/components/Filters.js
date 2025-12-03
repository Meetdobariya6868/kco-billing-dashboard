import React, { useMemo } from 'react';

export default function Filters({ data, filters, setFilters }) {
  const options = useMemo(() => {
    if (!data) return { clouds: ['All'], teams: ['All'], envs: ['All'] };
    const clouds = Array.from(new Set(data.map(d => d.cloud))).sort();
    const teams = Array.from(new Set(data.map(d => d.team))).sort();
    const envs = Array.from(new Set(data.map(d => d.env))).sort();
    return { clouds: ['All', ...clouds], teams: ['All', ...teams], envs: ['All', ...envs] };
  }, [data]);

  return (
    <div className="filters-card">
      <div className="filters-grid">
        <div>
          <label className="label">Cloud provider</label>
          <select value={filters.cloud} onChange={e => setFilters(f => ({ ...f, cloud: e.target.value }))} className="input">
            {options.clouds.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Team</label>
          <select value={filters.team} onChange={e => setFilters(f => ({ ...f, team: e.target.value }))} className="input">
            {options.teams.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Environment</label>
          <select value={filters.env} onChange={e => setFilters(f => ({ ...f, env: e.target.value }))} className="input">
            {options.envs.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
