// frontend/src/pages/masters/CurrencyMaintenance.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import toast from 'react-hot-toast';
import '../../styles/CurrencyMaintenance.css';

const API_BASE = 'http://localhost:5000/api/currencies';

const CurrencyMaintenance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    isLocal: false,
    buyRate: '',
    sellRate: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) setSidebarOpen(JSON.parse(saved));
    fetchCurrencies();
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const fetchCurrencies = async () => {
    try {
      const res = await fetch(`${API_BASE}/getAllCurrencies`);
      const data = await res.json();
      if (data.success) setCurrencies(data.data);
    } catch (err) {
      toast.error('Failed to load currencies');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Code and Name are required!');
      return;
    }

    setLoading(true);
    toast.promise(
      fetch(`${API_BASE}/createCurrency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message);
        setFormData({ code: '', name: '', isLocal: false, buyRate: '', sellRate: '' });
        fetchCurrencies();
      }),
      {
        loading: 'Saving currency...',
        success: 'Currency added successfully!',
        error: 'Failed to save currency'
      }
    ).finally(() => setLoading(false));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="page-content">
          <div className="page-wrapper">
            <div className="page-header">
              <h1 className="page-title">Currency Maintenance</h1>
              <p className="page-subtitle">Manage system currencies and exchange rates</p>
            </div>

            <div className="currency-card">
              <form onSubmit={handleSubmit} className="currency-form">
                <div className="form-grid">
                  <div className="input-group">
                    <label>Code <span className="required">*</span></label>
                    <input name="code" value={formData.code} onChange={handleChange} required disabled={loading} />
                  </div>
                  <div className="input-group">
                    <label>Name <span className="required">*</span></label>
                    <input name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
                  </div>
                  <div className="input-group">
                    <label>Buy Rate</label>
                    <input type="number" step="0.0001" name="buyRate" value={formData.buyRate} onChange={handleChange} disabled={loading} />
                  </div>
                  <div className="input-group">
                    <label>Sell Rate</label>
                    <input type="number" step="0.0001" name="sellRate" value={formData.sellRate} onChange={handleChange} disabled={loading} />
                  </div>
                </div>

                <div className="checkbox-section">
                  <label className="checkbox-item">
                    <input type="checkbox" name="isLocal" checked={formData.isLocal} onChange={handleChange} disabled={loading} />
                    <span className="checkmark"></span>
                    This is Local Currency
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    <span className="material-symbols-rounded">save</span>
                    {loading ? 'Saving...' : 'Add Currency'}
                  </button>
                </div>
              </form>

              <div className="currency-table">
                <h3>All Currencies</h3>
                {currencies.length === 0 ? (
                  <p className="no-data">No currencies added yet</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Buy Rate</th>
                        <th>Sell Rate</th>
                        <th>Local</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currencies.map(c => (
                        <tr key={c._id} className={c.isLocal ? 'local-currency' : ''}>
                          <td><strong>{c.code}</strong></td>
                          <td>{c.name}</td>
                          <td>{c.buyRate || '-'}</td>
                          <td>{c.sellRate || '-'}</td>
                          <td>{c.isLocal ? 'Yes' : 'No'}</td>
                          <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyMaintenance;