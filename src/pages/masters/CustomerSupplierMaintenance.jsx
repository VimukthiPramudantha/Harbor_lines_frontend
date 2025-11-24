import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import '../../styles/CustomerSupplier.css';

const API_BASE = 'http://localhost:5000/api/customersuppliers';

const CustomerSupplierMaintenance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('customer');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '', name: '', address: '', street: '', city: '', country: '',
    telNo: '', email: '', customerType: '', category: '',
    isConsignee: false, isNotifyParty: false,
    isSupplier: false, isAgent: false,
  });

  const customerTypes = ['Boi', 'Foreing', 'General', 'Local', 'Principle 01', 'Principle 02', 'Principle 03', 'Trico'];
  const categories = ['Normal', 'Bad Outstanding'];

  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) setSidebarOpen(JSON.parse(saved));
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
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

    // Beautiful toast promise — just like Login.jsx
    toast.promise(
      fetch(`${API_BASE}/createCustomerSupplier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          ...formData
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save');
        return res.json();
      })
      .then(data => {
        if (!data.success) throw new Error(data.message || 'Save failed');
        // Reset form on success
        setFormData({
          code: '', name: '', address: '', street: '', city: '', country: '',
          telNo: '', email: '', customerType: '', category: '',
          isConsignee: false, isNotifyParty: false,
          isSupplier: false, isAgent: false,
        });
        return data;
      }),
      {
        loading: 'Saving your data...',
        success: `${activeTab === 'customer' ? 'Customer' : 'Supplier'} saved successfully!`,
        error: (err) => err.message || 'Failed to save. Please try again.',
      },
      {
        style: {
          minWidth: '300px',
          fontSize: '1rem',
        },
        success: {
          duration: 4000,
          icon: 'Saved',
        },
        error: {
          duration: 5000,
          icon: 'Error',
        },
      }
    )
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="page-content">
          <div className="page-wrapper">
            <div className="page-header">
              <h1 className="page-title">Customer / Supplier Maintenance</h1>
              <p className="page-subtitle">Add and manage customers and suppliers</p>
            </div>

            <div className="maintenance-card">
              <div className="modern-tabs">
                <button
                  className={`tab-btn ${activeTab === 'customer' ? 'active' : ''}`}
                  onClick={() => setActiveTab('customer')}
                >
                  <span className="material-symbols-rounded">person</span>
                  Customer
                </button>
                <button
                  className={`tab-btn ${activeTab === 'supplier' ? 'active' : ''}`}
                  onClick={() => setActiveTab('supplier')}
                >
                  <span className="material-symbols-rounded">local_shipping</span>
                  Supplier
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-grid">
                  <div className="input-group">
                    <label>Code <span className="required">*</span></label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} required disabled={loading} />
                  </div>
                  <div className="input-group">
                    <label>Name <span className="required">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
                  </div>

                  <div className="input-group full">
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={loading} />
                  </div>

                  <div className="input-group">
                    <label>Street</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} disabled={loading} />
                  </div>
                  <div className="input-group">
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} disabled={loading} />
                  </div>
                  <div className="input-group">
                    <label>Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} disabled={loading} />
                  </div>

                  <div className="input-group">
                    <label>Tel No.</label>
                    <input type="tel" name="telNo" value={formData.telNo} onChange={handleChange} disabled={loading} />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={loading} />
                  </div>

                  <div className="input-group">
                    <label>Customer Type</label>
                    <select name="customerType" value={formData.customerType} onChange={handleChange} disabled={loading}>
                      <option value="">Select Type</option>
                      {customerTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} disabled={loading}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="checkbox-grid">
                  {activeTab === 'customer' ? (
                    <>
                      <label className="checkbox-item">
                        <input type="checkbox" name="isConsignee" checked={formData.isConsignee} onChange={handleChange} disabled={loading} />
                        <span className="checkmark"></span>
                        Consignee
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" name="isNotifyParty" checked={formData.isNotifyParty} onChange={handleChange} disabled={loading} />
                        <span className="checkmark"></span>
                        Notify Party
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="checkbox-item">
                        <input type="checkbox" name="isSupplier" checked={formData.isSupplier} onChange={handleChange} disabled={loading} />
                        <span className="checkmark"></span>
                        Supplier
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" name="isAgent" checked={formData.isAgent} onChange={handleChange} disabled={loading} />
                        <span className="checkmark"></span>
                        Origin/Destination Agent
                      </label>
                    </>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <span className="material-symbols-rounded">save</span>
                        Save {activeTab === 'customer' ? 'Customer' : 'Supplier'}
                      </>
                    )}
                  </button>
                  <button type="button" className="btn-secondary" disabled={loading}>
                    <span className="material-symbols-rounded">close</span>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupplierMaintenance;