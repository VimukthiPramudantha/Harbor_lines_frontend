// frontend/src/pages/masters/UnitOfMeasurementMaintenance.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import toast from 'react-hot-toast';
import '../../styles/UnitOfMeasurementMaintenance.css';

const API_BASE = 'http://localhost:5000/api/uoms';

const UnitOfMeasurementMaintenance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uoms, setUoms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit Mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'inventory' // default
  });

  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) setSidebarOpen(JSON.parse(saved));
    fetchUOMs();
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const fetchUOMs = async () => {
    try {
      const res = await fetch(`${API_BASE}/getAllUOMs`);
      const data = await res.json();
      if (data.success) setUoms(data.data);
    } catch (err) {
      toast.error('Failed to load UOMs');
    }
  };

  const openEditModal = async () => {
    await fetchUOMs();
    setShowEditModal(true);
    setSearchTerm('');
  };

  const selectForEdit = (uom) => {
    setFormData({
      code: uom.code,
      name: uom.name,
      type: uom.type
    });
    setIsEditMode(true);
    setEditingId(uom._id);
    setShowEditModal(false);
    toast.success('UOM loaded for editing');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Code and Name are required!');
      return;
    }

    setLoading(true);

    const url = isEditMode
      ? `${API_BASE}/updateUOM/${editingId}`
      : `${API_BASE}/createUOM`;

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
        fetchUOMs();
        if (!isEditMode) {
          setFormData({ code: '', name: '', type: 'inventory' });
        }
        setIsEditMode(false);
        setEditingId(null);
      }),
      {
        loading: isEditMode ? 'Updating...' : 'Saving...',
        success: isEditMode ? 'UOM updated!' : 'UOM added!',
        error: 'Operation failed'
      }
    ).finally(() => setLoading(false));
  };

  const handleCancel = () => {
    setFormData({ code: '', name: '', type: 'inventory' });
    setIsEditMode(false);
    setEditingId(null);
    toast.success('Form cleared');
  };

  const filtered = uoms.filter(u =>
    u.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="page-content">
          <div className="page-wrapper">
            <div className="page-header">
              <h1 className="page-title">Unit of Measurement Maintenance</h1>
              <p className="page-subtitle">Manage UOMs for Flight and Inventory</p>
            </div>

            <div className="uom-card">
              <form onSubmit={handleSubmit} className="uom-form">
                <div className="form-grid">
                  <div className="input-group">
                    <label>Code <span className="required">*</span></label>
                    <input name="code" value={formData.code} onChange={handleChange} required disabled={loading} maxLength="10" />
                  </div>
                  <div className="input-group">
                    <label>Name <span className="required">*</span></label>
                    <input name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
                  </div>
                  <div className="input-group">
                    <label>Type <span className="required">*</span></label>
                    <select name="type" value={formData.type} onChange={handleChange} disabled={loading}>
                      <option value="inventory">Inventory</option>
                      <option value="flight">Flight</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-edit" onClick={openEditModal}>
                    <span className="material-symbols-rounded">edit</span>
                    Edit Existing
                  </button>

                  <div style={{ flex: 1 }}></div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    <span className="material-symbols-rounded">save</span>
                    {loading ? 'Saving...' : (isEditMode ? 'Update UOM' : 'Add UOM')}
                  </button>

                  <button type="button" className="btn-secondary" onClick={handleCancel} disabled={loading}>
                    <span className="material-symbols-rounded">close</span>
                    Cancel
                  </button>
                </div>
              </form>

              {/* UOM Table */}
              <div className="uom-table">
                <h3>All Units of Measurement</h3>
                {uoms.length === 0 ? (
                  <p className="no-data">No UOMs added yet</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uoms.map(u => (
                        <tr key={u._id} className={u.type === 'flight' ? 'flight-uom' : 'inventory-uom'}>
                          <td><strong>{u.code}</strong></td>
                          <td>{u.name}</td>
                          <td>
                            <span className={`type-badge ${u.type}`}>
                              {u.type === 'flight' ? 'Flight' : 'Inventory'}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select UOM to Edit</h2>
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
                <p className="no-data">No UOMs found</p>
              ) : (
                filtered.map(uom => (
                  <div key={uom._id} className="list-item" onClick={() => selectForEdit(uom)}>
                    <div>
                      <strong>{uom.code}</strong> - {uom.name}
                      <span className={`type-badge small ${uom.type}`}>
                        {uom.type}
                      </span>
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

export default UnitOfMeasurementMaintenance;