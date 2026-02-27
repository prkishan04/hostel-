import { useEffect, useState } from 'react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ComplaintForm from './components/ComplaintForm';
import ComplaintList from './components/ComplaintList';
import AdminComplaintList from './components/AdminComplaintList';

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('login');
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      setUser(JSON.parse(u));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTab('login');
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>HostelOps – Complaint Management</h1>
      </div>

      <div style={styles.container}>
        {!user && (
          <div style={styles.authTabs}>
            <button
              style={tab === 'login' ? styles.activeTab : styles.tab}
              onClick={() => setTab('login')}
            >
              Login
            </button>
            <button
              style={tab === 'register' ? styles.activeTab : styles.tab}
              onClick={() => setTab('register')}
            >
              Register
            </button>
          </div>
        )}

        {!user && tab === 'login' && (
          <LoginForm onLoggedIn={setUser} />
        )}
        {!user && tab === 'register' && (
          <RegisterForm onRegistered={() => setTab('login')} />
        )}

        {user && (
          <div>
            <div style={styles.userBar}>
              <span>
                Logged in as <strong>{user.name}</strong> ({user.role})
              </span>
              <button style={styles.logout} onClick={handleLogout}>Logout</button>
            </div>

            {user.role === 'student' && (
              <div style={styles.grid}>
                <ComplaintForm onSubmitted={() => setRefreshToken(t => t + 1)} />
                <ComplaintList refreshToken={refreshToken} />
              </div>
            )}

            {user.role === 'admin' && (
              <AdminComplaintList />
            )}
          </div>
        )}

        {!user && (
          <div style={styles.infoBox}>
            <p><strong>Admin demo login:</strong></p>
            <p>Email: admin@hostelops.local</p>
            <p>Password: admin123</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: 'system-ui, sans-serif', background: '#f5f5f5', minHeight: '100vh' },
  header: { padding: 16, textAlign: 'center', background: '#343a40', color: 'white' },
  container: { margin: '24px auto', maxWidth: 900, background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.05)' },
  authTabs: { display: 'flex', gap: 8, marginBottom: 16 },
  tab: { flex: 1, padding: 8, border: '1px solid #ccc', background: '#eee' },
  activeTab: { flex: 1, padding: 8, border: '1px solid #007bff', background: '#007bff', color: 'white' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'flex-start' },
  userBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logout: { padding: '6px 12px', borderRadius: 4, border: 'none', background: '#dc3545', color: 'white' },
  infoBox: { marginTop: 24, fontSize: 13, color: '#555' }
};

