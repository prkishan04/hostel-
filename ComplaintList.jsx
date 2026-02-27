import { useEffect, useState } from 'react';
import { apiRequest } from '../api';

export default function ComplaintList({ refreshToken }) {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setError(null);
      const data = await apiRequest('/complaints');
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [refreshToken]);

  return (
    <div>
      <h3>Your Complaints</h3>
      {error && <div style={styles.error}>{error}</div>}
      {complaints.length === 0 && <div>No complaints yet.</div>}
      <ul style={styles.list}>
        {complaints.map(c => (
          <li key={c.id} style={styles.item}>
            <div><strong>Category:</strong> {c.category}</div>
            <div><strong>Priority:</strong> {c.priority}</div>
            <div><strong>Status:</strong> {c.status}</div>
            <div style={styles.desc}>{c.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  item: { padding: 8, borderRadius: 4, border: '1px solid #ddd' },
  desc: { fontSize: 13, marginTop: 4 },
  error: { color: 'red', fontSize: 12 }
};

