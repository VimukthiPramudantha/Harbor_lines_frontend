// frontend/src/pages/masters/CustomerSupplierMaintenance.jsx
import { useState } from 'react';
import '../../styles/CustomerSupplier.css';

const CustomerSupplierMaintenance = () => {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'supplier'
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    street: '',
    city: '',
    country: '',
    telNo: '',
    email: '',
    customerType: '',
    category: '',
    isConsignee: false,
    isNotifyParty: false,
    isSupplier: false,
    isAgent: false,
  });

  const customerTypes = [
    'Boi', 'Foreing', 'General', 'Local', 
    'Principle 01', 'Principle 02', 'Principle 03', 'Trico'
  ];

  const categories = ['Normal', 'Bad Outstanding'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    alert(`${activeTab.toUpperCase()} saved successfully!`);
  };

  return (
    <div className="maintenance-container">
      <div className="maintenance-card">
        <h1 className="page-title">Customer / Supplier Maintenance</h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'customer' ? 'active' : ''}`}
            onClick={() => setActiveTab('customer')}
          >
            Customer
          </button>
          <button
            className={`tab ${activeTab === 'supplier' ? 'active' : ''}`}
            onClick={() => setActiveTab('supplier')}
          >
            Supplier
          </button>
        </div>

        <form onSubmit={handleSubmit} className="maintenance-form">
          <div className="form-grid">
            {/* Row 1 */}
            <div className="form-group">
              <label>Code <span className="required">*</span></label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 2 */}
            <div className="form-group full">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Row 3 */}
            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            {/* Row 4 */}
            <div className="form-group">
              <label>Tel No.</label>
              <input
                type="text"
                name="telNo"
                value={formData.telNo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Customer Type</label>
              <select name="customerType" value={formData.customerType} onChange={handleChange}>
                <option value="">Select Type</option>
                {customerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Checkboxes */}
          <div className="checkbox-section">
            {activeTab === 'customer' ? (
              <>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isConsignee"
                    checked={formData.isConsignee}
                    onChange={handleChange}
                  />
                  <span>Consignee</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isNotifyParty"
                    checked={formData.isNotifyParty}
                    onChange={handleChange}
                  />
                  <span>Notify Party</span>
                </label>
              </>
            ) : (
              <>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isSupplier"
                    checked={formData.isSupplier}
                    onChange={handleChange}
                  />
                  <span>Supplier</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isAgent"
                    checked={formData.isAgent}
                    onChange={handleChange}
                  />
                  <span>Origin/Destination Agent</span>
                </label>
              </>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              Save {activeTab === 'customer' ? 'Customer' : 'Supplier'}
            </button>
            <button type="button" className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerSupplierMaintenance;