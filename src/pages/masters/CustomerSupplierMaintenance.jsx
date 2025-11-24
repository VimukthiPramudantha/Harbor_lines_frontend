import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import '../../styles/CustomerSupplier.css';

const CustomerSupplierMaintenance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('customer');

  const [formData, setFormData] = useState({
    code: '', name: '', address: '', street: '', city: '', country: '',
    telNo: '', email: '', customerType: '', category: '',
    isConsignee: false, isNotifyParty: false,
    isSupplier: false, isAgent: false,
  });

  const customerTypes = ['Boi', 'Foreing', 'General', 'Local', 'Principle 01', 'Principle 02', 'Principle 03', 'Trico'];
  const categories = ['Normal', 'Bad Outstanding'];

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      setSidebarOpen(JSON.parse(saved));
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${activeTab === 'customer' ? 'Customer' : 'Supplier'} saved successfully!`);
    console.log('Saved:', { type: activeTab, ...formData });
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <div className="page-content">
          <div className="page-wrapper">
            <div className="page-header">
              <h1 className="page-title">Customer / Supplier Maintenance</h1>
              <p className="page-subtitle">Add and manage customers and suppliers</p>
            </div>

            <div className="maintenance-card">
              {/* Modern Tabs with Icons */}
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
                    <input type="text" name="code" value={formData.code} onChange={handleChange} required />
                  </div>

                  <div className="input-group">
                    <label>Name <span className="required">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="input-group full">
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>Street</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>Tel No.</label>
                    <input type="tel" name="telNo" value={formData.telNo} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>Customer Type</label>
                    <select name="customerType" value={formData.customerType} onChange={handleChange}>
                      <option value="">Select Type</option>
                      {customerTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Beautiful Checkboxes */}
                <div className="checkbox-grid">
                  {activeTab === 'customer' ? (
                    <>
                      <label className="checkbox-item">
                        <input type="checkbox" name="isConsignee" checked={formData.isConsignee} onChange={handleChange} />
                        <span className="checkmark"></span>
                        Consignee
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" name="isNotifyParty" checked={formData.isNotifyParty} onChange={handleChange} />
                        <span className="checkmark"></span>
                        Notify Party
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="checkbox-item">
                        <input type="checkbox" name="isSupplier" checked={formData.isSupplier} onChange={handleChange} />
                        <span className="checkmark"></span>
                        Supplier
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" name="isAgent" checked={formData.isAgent} onChange={handleChange} />
                        <span className="checkmark"></span>
                        Origin/Destination Agent
                      </label>
                    </>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <span className="material-symbols-rounded">save</span>
                    Save {activeTab === 'customer' ? 'Customer' : 'Supplier'}
                  </button>
                  <button type="button" className="btn-secondary">
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