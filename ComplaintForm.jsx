import { useState } from 'react';
import { apiRequest } from '../api';

export default function ComplaintForm({ onSubmitted }) {
  const [form, setForm] = useState({
    category: '',
    description: '',
    priority: 'Low'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiRequest('/complaints', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setForm({ category: '', description: '', priority: 'Low' });
      onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Submit Complaint</h3>
      <input
        style={styles.input}
        placeholder="Category (e.g. Plumbing, Electricity)"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
      />
      <textarea
        style={styles.textarea}
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <select
        style={styles.input}
        value={form.priority}
        onChange={e => setForm({ ...form, priority: e.target.value })}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      {error && <div style={styles.error}>{error}</div>}
      <button style={styles.button} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 },
  input: { padding: 8, borderRadius: 4, border: '1px solid #ccc' },
  textarea: { padding: 8, borderRadius: 4, border: '1px solid #ccc', minHeight: 80 },
  button: { padding: 10, borderRadius: 4, border: 'none', background: '#0069d9', color: 'white' },
  error: { color: 'red', fontSize: 12 }
};

