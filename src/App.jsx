// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Dashboard from './pages/Dashboard.jsx'; 
import { useAuth } from './context/AuthContext.jsx';

// === MASTER FILES ===
import CustomerSupplierMaintenance from './pages/masters/CustomerSupplierMaintenance.jsx';
import CurrencyMaintenance from './pages/masters/CurrencyMaintenance.jsx';
import UnitOfMeasurementMaintenance from './pages/masters/UnitOfMeasurementMaintenance.jsx';
import BankMaintenance from './pages/masters/BankMaintenance.jsx';
import TaxMaintenance from './pages/masters/TaxMaintenance.jsx';

// === FREIGHT MASTER ===
import VesselMaintenance from './pages/freight/VesselMaintenance.jsx';
import FlightMaintenance from './pages/freight/FlightMaintenance.jsx';
import SeaDestinationMaintenance from './pages/freight/SeaDestinationMaintenance.jsx';
import AirDestinationMaintenance from './pages/freight/AirDestinationMaintenance.jsx';

// === SEA FREIGHT IMPORT JOBS ===
import JobMasterImport from './pages/sea-freight/import/JobMasterImport.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'grid', 
        placeItems: 'center',
        background: '#f8fafc',
        fontSize: '1.5rem',
        color: '#475569'
      }}>
        Loading Harbour Lines ERP...
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        {/* === MASTER FILES === */}
        <Route path="/masters/customers" element={
          <ProtectedRoute><CustomerSupplierMaintenance /></ProtectedRoute>
        } />
        <Route path="/masters/currency" element={
          <ProtectedRoute><CurrencyMaintenance /></ProtectedRoute>
        } />
        <Route path="/masters/uom" element={
          <ProtectedRoute><UnitOfMeasurementMaintenance /></ProtectedRoute>
        } />
        <Route path="/masters/bank" element={
          <ProtectedRoute><BankMaintenance /></ProtectedRoute>
        } />
        <Route path="/masters/tax" element={
          <ProtectedRoute><TaxMaintenance /></ProtectedRoute>
        } />

        {/* === FREIGHT MASTER === */}
        <Route path="/freight/vessel" element={
          <ProtectedRoute><VesselMaintenance /></ProtectedRoute>
        } />
        <Route path="/freight/flight" element={
          <ProtectedRoute><FlightMaintenance /></ProtectedRoute>
        } />
        <Route path="/freight/sea-destination" element={
          <ProtectedRoute><SeaDestinationMaintenance /></ProtectedRoute>
        } />
        <Route path="/freight/air-destination" element={
          <ProtectedRoute><AirDestinationMaintenance /></ProtectedRoute>
        } />

        {/* === SEA FREIGHT JOBS → IMPORT === */}
        <Route path="/sea-freight/import/job-master" element={
          <ProtectedRoute><JobMasterImport /></ProtectedRoute>
        } />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;