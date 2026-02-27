import { useEffect, useState } from 'react';
import { apiRequest } from '../api';

export default function AdminComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({ category: '', status: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      const qs = params.toString() ? `?${params.toString()}` : '';
      const data = await apiRequest(`/admin/complaints${qs}`);
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []); // initial load

  async function updateStatus(id, status) {
    try {
      await apiRequest(`/admin/complaints/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Admin – Complaints</h2>
      <div style={styles.filters}>
        <input
          style={styles.input}
          placeholder="Filter by category"
          value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
        />
        <select
          style={styles.input}
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <button style={styles.button} onClick={load} disabled={loading}>
          {loading ? 'Loading...' : 'Apply'}
        </button>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <ul style={styles.list}>
        {complaints.map(c => (
          <li key={c.id} style={styles.item}>
            <div><strong>Student:</strong> {c.student_name} ({c.student_email})</div>
            <div><strong>Category:</strong> {c.category}</div>
            <div><strong>Priority:</strong> {c.priority}</div>
            <div><strong>Status:</strong> {c.status}</div>
            <div style={styles.desc}>{c.description}</div>
            <div style={styles.statusButtons}>
              {['Pending', 'In Progress', 'Resolved'].map(s => (
                <button
                  key={s}
                  style={{
                    ...styles.smallButton,
                    background: c.status === s ? '#17a2b8' : '#6c757d'
                  }}
                  onClick={() => updateStatus(c.id, s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  filters: { display: 'flex', gap: 8, marginBottom: 12 },
  input: { padding: 6, borderRadius: 4, border: '1px solid #ccc' },
  button: { padding: 8, borderRadius: 4, border: 'none', background: '#007bff', color: 'white' },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  item: { padding: 8, borderRadius: 4, border: '1px solid #ddd' },
  desc: { fontSize: 13, marginTop: 4 },
  statusButtons: { display: 'flex', gap: 4, marginTop: 8 },
  smallButton: { padding: '4px 8px', borderRadius: 4, border: 'none', color: 'white', fontSize: 12 },
  error: { color: 'red', fontSize: 12 }
};

