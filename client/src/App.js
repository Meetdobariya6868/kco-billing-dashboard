// import Dashboard from "./pages/Dashboard";

// function App() {
//   return <Dashboard />;
// }

// export default App;



import React, { useMemo, useState, useCallback } from 'react';
import useRealtimeData from './hooks/useRealtimeData';
import Filters from './components/Filters';
import DataTable from './components/DataTable';
import Summary from './components/Summary';
import DetailModal from './components/DetailModal';
import MonthlyChart from './components/MonthlyChart';

export default function App() {
  const { data, loading } = useRealtimeData();

  const [filters, setFilters] = useState({ cloud: 'All', team: 'All', env: 'All' });
  const [sortBy, setSortBy] = useState({ key: 'date', dir: 'desc' });

  // Modal state
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const openDetail = useCallback((row) => { setSelectedRow(row); setModalOpen(true); }, []);
  const closeDetail = useCallback(()=>{ setModalOpen(false); setSelectedRow(null); }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(row => {
      const cloudOk = filters.cloud === 'All' || row.cloud === filters.cloud;
      const teamOk = filters.team === 'All' || row.team === filters.team;
      const envOk = filters.env === 'All' || row.env === filters.env;
      return cloudOk && teamOk && envOk;
    });
  }, [data, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy.key === 'cost') {
      arr.sort((a,b) => ((a.cost - b.cost) * (sortBy.dir === 'asc' ? 1 : -1)));
    } else if (sortBy.key === 'date') {
      arr.sort((a,b) => ((new Date(a.date) - new Date(b.date)) * (sortBy.dir === 'asc' ? 1 : -1)));
    }
    return arr;
  }, [filtered, sortBy]);

  return (
    <div className="app-root">
      <div className="container">
        <header className="header">
          <div>
            <h1 className="title">Cloud Spend Dashboard</h1>
            <p className="subtitle">Live, filterable breakdown of cloud spend by team & environment</p>
          </div>

          <div className="status">
            <span className="status-dot" />
            <span className="status-text">Real-time</span>
          </div>
        </header>

        <main className="main-grid">
          <section className="left-col">
            <Filters data={data} filters={filters} setFilters={setFilters} />
            <div className="table-card">
              <DataTable
                rows={sorted}
                loading={loading}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onRowClick={openDetail}
              />
            </div>

            <div style={{marginTop:12, background:'#fff', padding:12, borderRadius:8, border:'1px solid #e6eef8'}}>
              <h4 style={{margin:'0 0 8px 0'}}>Monthly spend</h4>
              <MonthlyChart rows={filtered} />
            </div>
          </section>

          <aside className="right-col">
            <Summary rows={filtered} />
            <div className="hint">Tip: click Date or Cost headers to toggle sort. Click a row for details.</div>
          </aside>
        </main>
      </div>

      <DetailModal open={modalOpen} onClose={closeDetail} row={selectedRow} />
    </div>
  );
}
