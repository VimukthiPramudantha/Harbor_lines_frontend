// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Dashboard from './pages/Dashboard.jsx'; 
import { useAuth } from './context/AuthContext.jsx';
import CustomerSupplierMaintenance from './pages/masters/CustomerSupplierMaintenance.jsx'
import CurrencyMaintenance from './pages/masters/CurrencyMaintenance.jsx'
import UnitOfMeasurementMaintenance from './pages/masters/UnitOfMeasurementMaintenance.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{height:'100vh',display:'grid',placeItems:'center'}}>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/masters/customers" element={<CustomerSupplierMaintenance />} />
        <Route path="/masters/currency" element={<CurrencyMaintenance />} />
        <Route path="/masters/uom" element={<UnitOfMeasurementMaintenance />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;