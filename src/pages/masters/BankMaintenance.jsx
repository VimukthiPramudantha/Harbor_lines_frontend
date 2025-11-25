// frontend/src/pages/masters/BankMaintenance.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import toast from 'react-hot-toast';
import '../../styles/BankMaintenance.css';

const API_BASE = 'http://localhost:5000/api/banks';

const BankMaintenance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');
  const [loading, setLoading] = useState(false);

  // Edit Mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [banks, setBanks] = useState([]);

  const [formData, setFormData] = useState({
    // Tab 1
    bankCode: '',
    bankName: '',
    accountName: '',
    accountAddress: '',
    accountStreet: '',
    accountCity: '',
    accountNumber: '',

    // Tab 2
    bankAddress: '',
    bankStreet: '',
    bankCity: '',
    telephone: '',
    swiftCode: '',
    isCompanyAccount: false,
    chequeNo: '',

    // GL Accounts
    bankChargesCode: '',
    bankChargesName: '',
    glAccountCode: '',
    glAccountName: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) setSidebarOpen(JSON.parse(saved));
    fetchBanks();
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const fetchBanks = async () => {
    try {
      const res = await fetch(`${API_BASE}/getAllBanks`);
      const data = await res.json();
      if (data.success) setBanks(data.data);
    } catch (err) {
      toast.error('Failed to load banks');
    }
  };

  // Validate Tab 1 before allowing Tab 2
  const isTab1Valid = () => {
    return formData.bankCode && 
           formData.bankName && 
           formData.accountName && 
           formData.accountNumber;
  };

  const handleTabClick = (tab) => {
    if (tab === 'tab2' && !isTab1Valid() && !isEditMode) {
      toast.error('Please complete Bank & Company Information first!');
      return;
    }
    setActiveTab(tab);
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
    if (!isTab1Valid()) {
      toast.error('Please fill all required fields in Tab 1');
      setActiveTab('tab1');
      return;
    }

    setLoading(true);

    const url = isEditMode
      ? `${API_BASE}/updateBank/${editingId}`
      : `${API_BASE}/createBank`;

    const method = isEditMode ? 'PUT' : 'POST';

    toast.promise(
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(data => {
        if (!data.success) throw new Error(data.message);
        fetchBanks();
        if (!isEditMode) resetForm();
        setIsEditMode(false);
        setEditingId(null);
      }),
      {
        loading: isEditMode ? 'Updating...' : 'Saving...',
        success: isEditMode ? 'Bank updated!' : 'Bank added!',
        error: 'Operation failed'
      }
    ).finally(() => setLoading(false));
  };

  const resetForm = () => {
    setFormData({
      bankCode: '', bankName: '', bankAddress: '', bankStreet: '', bankCity: '',
      accountName: '', accountAddress: '', accountStreet: '', accountCity: '', accountNumber: '',
      telephone: '', swiftCode: '', isCompanyAccount: false, chequeNo: '',
      bankChargesCode: '', bankChargesName: '', glAccountCode: '', glAccountName: ''
    });
    setActiveTab('tab1');
  };

  const handleCancel = () => {
    resetForm();
    setIsEditMode(false);
    setEditingId(null);
    toast.success('Form cleared');
  };

  const openEditModal = async () => {
    await fetchBanks();
    setShowEditModal(true);
    setSearchTerm('');
  };

  const selectForEdit = (bank) => {
    setFormData({ ...bank });
    setIsEditMode(true);
    setEditingId(bank._id);
    setShowEditModal(false);
    toast.success('Bank loaded for editing');
  };

  const filtered = banks.filter(b =>
    b.bankCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="page-content">
          <div className="page-wrapper">
            <div className="page-header">
              <h1 className="page-title">Bank Maintenance</h1>
              <p className="page-subtitle">Manage bank and company account details</p>
            </div>

            <div className="bank-card">
              <div className="tab-header">
                <button
                  className={`tab-btn ${activeTab === 'tab1' ? 'active' : ''}`}
                  onClick={() => handleTabClick('tab1')}
                >
                  Bank & Company Info
                </button>
                <button
                  className={`tab-btn ${activeTab === 'tab2' ? 'active' : ''}`}
                  onClick={() => handleTabClick('tab2')}
                  disabled={!isTab1Valid() && !isEditMode}
                >
                  Bank Details & GL Accounts
                </button>
              </div>

              <form onSubmit={handleSubmit} className="bank-form">
                {activeTab === 'tab1' && (
                  <div className="tab-content">
                    <div className="section">
                      <h3>Bank Information</h3>
                      <div className="form-grid">
                        <div className="input-group">
                          <label>Bank Code <span className="required">*</span></label>
                          <input name="bankCode" value={formData.bankCode} onChange={handleChange} required disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>Bank Name <span className="required">*</span></label>
                          <input name="bankName" value={formData.bankName} onChange={handleChange} required disabled={loading} />
                        </div>
                      </div>
                    </div>

                    <div className="section">
                      <h3>Company Account Information</h3>
                      <div className="form-grid">
                        <div className="input-group">
                          <label>Account Name <span className="required">*</span></label>
                          <input name="accountName" value={formData.accountName} onChange={handleChange} required disabled={loading} />
                        </div>
                        <div className="input-group full">
                          <label>Address</label>
                          <input name="accountAddress" value={formData.accountAddress} onChange={handleChange} disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>Street</label>
                          <input name="accountStreet" value={formData.accountStreet} onChange={handleChange} disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>City</label>
                          <input name="accountCity" value={formData.accountCity} onChange={handleChange} disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>Account Number <span className="required">*</span></label>
                          <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} required disabled={loading} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tab2' && (
                  <div className="tab-content">
                    <div className="section">
                      <h3>Bank Contact Information</h3>
                      <div className="form-grid">
                        <div className="input-group full">
                          <label>Bank Address</label>
                          <input name="bankAddress" value={formData.bankAddress} onChange={handleChange} disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>Street</label>
                          <input name="bankStreet" value={formData.bankStreet} onChange={handleChange} disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>City</label>
                          <input name="bankCity" value={formData.bankCity} onChange={handleChange} disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>Telephone</label>
                          <input name="telephone" value={formData.telephone} onChange={handleChange} disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>SWIFT Code</label>
                          <input name="swiftCode" value={formData.swiftCode} onChange={handleChange} disabled={loading} />
                        </div>
                      </div>

                      <div className="checkbox-section">
                        <label className="checkbox-item">
                          <input type="checkbox" name="isCompanyAccount" checked={formData.isCompanyAccount} onChange={handleChange} disabled={loading} />
                          <span className="checkmark"></span>
                          This is Company Account
                        </label>
                        <div className="input-group inline">
                          <label>Cheque No. Prefix</label>
                          <input name="chequeNo" value={formData.chequeNo} onChange={handleChange} disabled={loading} />
                        </div>
                      </div>
                    </div>

                    <div className="section">
                      <h3>GL Account Details</h3>
                      <div className="form-grid">
                        <div className="input-group">
                          <label>Bank Charges Account Code</label>
                          <input name="bankChargesCode" value={formData.bankChargesCode} onChange={handleChange} disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>Bank Charges Account Name</label>
                          <input name="bankChargesName" value={formData.bankChargesName} onChange={handleChange} disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>GL Account Code</label>
                          <input name="glAccountCode" value={formData.glAccountCode} onChange={handleChange} disabled={loading} />
                        </div>
                        <div className="input-group">
                          <label>GL Account Name</label>
                          <input name="glAccountName" value={formData.glAccountName} onChange={handleChange} disabled={loading} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-edit" onClick={openEditModal}>
                    Edit Existing
                  </button>

                  <div style={{ flex: 1 }}></div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (isEditMode ? 'Update Bank' : 'Save Bank')}
                  </button>

                  <button type="button" className="btn-secondary" onClick={handleCancel} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select Bank to Edit</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-search">
              <input
                type="text"
                placeholder="Search by Code or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-list">
              {filtered.length === 0 ? (
                <p className="no-data">No banks found</p>
              ) : (
                filtered.map(bank => (
                  <div key={bank._id} className="list-item" onClick={() => selectForEdit(bank)}>
                    <div>
                      <strong>{bank.bankCode}</strong> - {bank.bankName}
                      <br />
                      <small>{bank.accountName} • {bank.accountNumber}</small>
                    </div>
                    <span className="material-symbols-rounded">arrow_forward_ios</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankMaintenance;