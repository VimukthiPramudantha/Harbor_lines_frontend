import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{padding: '2rem', fontFamily: 'Segoe UI'}}>
      <h1>Welcome to Harbour Lines</h1>
      <p>You are logged in as <strong>{user?.username}</strong> ({user?.role})</p>
      <button onClick={logout} style={{
        padding: '0.75rem 1.5rem',
        background: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;