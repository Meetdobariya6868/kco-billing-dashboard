import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { generateRandomRow } from '../utils/randomData';

export default function useRealtimeData(initialQuery = '') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const counterRef = useRef(100);
  const wsRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async function initial() {
      try {
        // Try server API with optional query for server-side filtering
        const resp = await axios.get(`/api/spend${initialQuery}`);
        if (!mounted) return;
        if (resp && Array.isArray(resp.data)) {
          setData(resp.data);
          setLoading(false);
          return;
        }
      } catch (e) {
        // fallback to simulated
      }

      const initial = Array.from({length:20}).map((_,i)=>generateRandomRow(i+1));
      if (!mounted) return;
      setData(initial);
      setLoading(false);
    })();

    // WebSocket setup & reconnection with backoff
    let reconnectAttempts = 0;
    function connectWS() {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
        wsRef.current = ws;
        ws.onopen = () => { reconnectAttempts = 0; console.info('ws connected'); };
        ws.onmessage = (ev) => {
          try {
            const parsed = JSON.parse(ev.data);
            if (parsed.type === 'append' && parsed.row) {
              setData(prev => [parsed.row, ...(prev || [])].slice(0, 1000));
            } else if (parsed.type === 'replace' && Array.isArray(parsed.rows)) {
              setData(parsed.rows);
            } else if (parsed.type === 'patch' && parsed.id) {
              setData(prev => (prev || []).map(r => r.id === parsed.id ? {...r, ...parsed.patch} : r));
            }
          } catch (err) { console.warn(err); }
        };
        ws.onclose = () => {
          console.info('ws closed');
          // try reconnect with exponential backoff
          reconnectAttempts += 1;
          const timeout = Math.min(30000, 1000 * Math.pow(1.5, reconnectAttempts));
          setTimeout(connectWS, timeout);
        };
        ws.onerror = () => ws.close();
      } catch (e) {
        // ignore
      }
    }
    connectWS();

    // fallback simulated updates
    const interval = setInterval(() => {
      setData(prev => {
        if (!prev) return prev;
        if (Math.random() < 0.65) {
          counterRef.current += 1;
          return [generateRandomRow(counterRef.current), ...prev].slice(0, 1000);
        }
        const idx = Math.floor(Math.random() * prev.length);
        const copy = prev.map(x => ({...x}));
        if (copy[idx]) copy[idx].cost = Math.max(0, Number((copy[idx].cost + (Math.random()-0.5)*200).toFixed(2)));
        return copy;
      });
    }, 5000 + Math.floor(Math.random()*3000));

    return () => {
      mounted = false;
      clearInterval(interval);
      if (wsRef.current) wsRef.current.close();
    };
  }, [initialQuery]);

  return { data, loading, setData };
}
