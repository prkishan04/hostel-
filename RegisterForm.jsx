import { useState } from 'react';
import { apiRequest } from '../api';

export default function RegisterForm({ onRegistered }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      onRegistered();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Student Register</h2>
      <input
        style={styles.input}
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      {error && <div style={styles.error}>{error}</div>}
      <button style={styles.button} disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 },
  input: { padding: 8, borderRadius: 4, border: '1px solid #ccc' },
  button: { padding: 10, borderRadius: 4, border: 'none', background: '#007bff', color: 'white' },
  error: { color: 'red', fontSize: 12 }
};

