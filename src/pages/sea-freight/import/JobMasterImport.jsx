// frontend/src/pages/sea-freight/import/JobMasterImport.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../../../components/layout/Sidebar.jsx';
import Navbar from '../../../components/layout/Navbar.jsx';
import toast from 'react-hot-toast';
import '../../../styles/JobMasterImport.css';

const API_BASE = 'http://localhost:5000/api/jobs/sea-import';

const JobMasterImport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  // Edit Mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Data from other masters
  const [currencies, setCurrencies] = useState([]);
  const [seaDestinations, setSeaDestinations] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [vessels, setVessels] = useState([]);
  const [vesselSearch, setVesselSearch] = useState('');
  const [showVesselDropdown, setShowVesselDropdown] = useState(false);

  const [formData, setFormData] = useState({
    jobNum: '', // ← Will be auto-generated
    jobDate: new Date().toISOString().slice(0,10),
    finalizeDate: new Date().toISOString().slice(0,10),
    jobCategory: 'Freight Forwarding',
    vesselId: '',
    vesselName: '',
    voyage: '',
    portDepartureId: '',
    portDepartureName: '',
    portDischargeId: '',
    portDischargeName: '',
    originAgentId: '',
    originAgentName: '',
    carrierId: '',
    carrierName: '',
    shipAgentId: '',
    shipAgentName: '',
    principleCustomerId: '',
    principleCustomerName: '',
    localAgentId: '',
    localAgentName: '',
    etaDateTime: '',
    status: 'Active',
    loadingVoyage: '',
    lastPortEtd: '',
    cargoCategory: 'FCL',
    commodity: 'General Cargo',
    currency: '',
    exchangeRate: '',
    terminalRef: '',
    service: '',
    terminal: 'JCT',
    slpaReference: '',
    numContainers: '',
    impNo: ''
  });

  const jobCategories = ['SOC', 'Freight Forwarding', 'Car Carrier', 'Casual Caller', 'Transhipment', 'Main Line', 'FF + Clearing', 'NVOCC'];
  const cargoCategories = ['Console', 'Co-loads', 'FCL'];
  const commodities = ['Cargo', 'General Cargo'];
  const terminals = ['JCT', 'UCT', 'SAGT', 'CICT', 'CWIT'];
  const statuses = ['Active', 'Inactive'];

  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) setSidebarOpen(JSON.parse(saved));
    fetchJobs();
    fetchCurrencies();
    fetchSeaDestinations();
    fetchCustomers();
    generateJobNumber(); 
    fetchVessels(); 
  }, []);

  // Auto-generate Job Number: HBL/IMP/001, 002, etc.
  const generateJobNumber = async () => {
    if (isEditMode) return; // Don't generate in edit mode

    try {
      const res = await fetch(`${API_BASE}/getAllJobs`);
      const data = await res.json();
      if (data.success) {
        const count = data.data.length;
        const nextNum = String(count + 1).padStart(3, '0');
        setFormData(prev => ({ ...prev, jobNum: `HBL/IMP/${nextNum}` }));
      }
    } catch (err) {
      // Fallback if API fails
      const nextNum = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
      setFormData(prev => ({ ...prev, jobNum: `HBL/IMP/${nextNum}` }));
    }
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/getAllJobs`);
      const data = await res.json();
      if (data.success) setJobs(data.data);
    } catch (err) {
      toast.error('Failed to load jobs');
    }
  };

  const fetchCurrencies = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/currencies/getAllCurrencies');
      const data = await res.json();
      if (data.success) setCurrencies(data.data);
    } catch (err) {
      toast.error('Failed to load currencies');
    }
  };

  const fetchSeaDestinations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/sea-destinations/getAllDestinations');
      const data = await res.json();
      if (data.success) setSeaDestinations(data.data);
    } catch (err) {
      toast.error('Failed to load sea destinations');
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/customersuppliers/getAllCustomerSuppliers?type=customer');
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } catch (err) {
      toast.error('Failed to load customers');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jobNum') return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobNum || !formData.jobDate) {
      toast.error('Job Number and Date are required!');
      return;
    }

    setLoading(true);

    const url = isEditMode
      ? `${API_BASE}/updateJob/${editingId}`
      : `${API_BASE}/createJob`;

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
        fetchJobs();
        if (!isEditMode) {
          generateJobNumber(); 
          setFormData(prev => ({ 
            ...prev, 
            jobDate: new Date().toISOString().slice(0,10), 
            finalizeDate: new Date().toISOString().slice(0,10) 
          }));
        }
        setIsEditMode(false);
        setEditingId(null);
      }),
      {
        loading: isEditMode ? 'Updating...' : 'Saving...',
        success: isEditMode ? 'Job updated!' : 'Job added!',
        error: 'Operation failed'
      }
    ).finally(() => setLoading(false));
  };

  const handleCancel = () => {
    generateJobNumber(); 
    setFormData(prev => ({
      ...prev,
      jobDate: new Date().toISOString().slice(0,10),
      finalizeDate: new Date().toISOString().slice(0,10),
      jobCategory: 'Freight Forwarding',
      vesselId: '', vesselName: '', voyage: '',
      portDepartureId: '', portDepartureName: '', portDischargeId: '', portDischargeName: '',
      originAgentId: '', originAgentName: '', carrierId: '', carrierName: '', shipAgentId: '', shipAgentName: '',
      principleCustomerId: '', principleCustomerName: '', localAgentId: '', localAgentName: '',
      etaDateTime: '', status: 'Active', loadingVoyage: '', lastPortEtd: '',
      cargoCategory: 'FCL', commodity: 'General Cargo', currency: '', exchangeRate: '',
      terminalRef: '', service: '', terminal: 'JCT', slpaReference: '', numContainers: '', impNo: ''
    }));
    setIsEditMode(false);
    setEditingId(null);
    toast.success('Form cleared');
  };

  const openEditModal = async () => {
    await fetchJobs();
    setShowEditModal(true);
    setSearchTerm('');
  };

  const selectForEdit = (job) => {
    setFormData(job);
    setIsEditMode(true);
    setEditingId(job._id);
    setShowEditModal(false);
    toast.success('Job loaded for editing');
  };

  const filtered = jobs.filter(j =>
    j.jobNum.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch Vessels from database
const fetchVessels = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/vessels/getAllVessels');
    const data = await res.json();
    if (data.success) setVessels(data.data);
  } catch (err) {
    toast.error('Failed to load vessels');
  }
};

// Filter vessels for dropdown
const filteredVessels = vessels.filter(v =>
  v.code.toLowerCase().includes(vesselSearch.toLowerCase()) ||
  v.name.toLowerCase().includes(vesselSearch.toLowerCase())
);

// Handle vessel selection
const handleVesselSelect = (vessel) => {
  setFormData(prev => ({
    ...prev,
    vesselId: vessel._id,
    vesselName: vessel.name
  }));
  setVesselSearch(`${vessel.code} - ${vessel.name}`);
  setShowVesselDropdown(false);
};
  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="page-content">
          <div className="page-wrapper">
            <div className="page-header">
              <h1 className="page-title">Sea Freight Import Job Maintenance</h1>
              <p className="page-subtitle">Create and manage sea import jobs</p>
            </div>

            <div className="job-card">
              <form onSubmit={handleSubmit} className="job-form">

                {/* Job Information */}
                <div className="section">
                  <h3>Job Information</h3>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Job Num <span className="required"></span></label>
                      <input 
                        value={formData.jobNum} 
                        readOnly 
                        disabled 
                        style={{ backgroundColor: '#f1f5f9', fontWeight: 'bold', color: '#000000ff' }}
                        placeholder="Auto-generated"
                      />
                      <small style={{ color: '#64748b', marginTop: '4px' }}>
                        Auto-generated
                      </small>
                    </div>
                    <div className="input-group">
                      <label>Job Date <span className="required"></span></label>
                      <input type="date" name="jobDate" value={formData.jobDate} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Finalize Date</label>
                      <input type="date" name="finalizeDate" value={formData.finalizeDate} onChange={handleChange} disabled={loading} />
                    </div>
                  </div>
                </div>

                {/* Job Category */}
                <div className="section">
                  <h3>Job Category</h3>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Category <span className="required"></span></label>
                      <select name="jobCategory" value={formData.jobCategory} onChange={handleChange} disabled={loading}>
                        {jobCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

               {/* Vessel Information - AUTO SUGGEST */}
                  <div className="section">
                    <h3>Vessel Information</h3>
                    <div className="form-grid">
                      <div className="input-group" style={{ position: 'relative' }}>
                        <label>Vessel <span className="required">*</span></label>
                        <input
                          type="text"
                          value={vesselSearch}
                          onChange={(e) => {
                            setVesselSearch(e.target.value);
                            setShowVesselDropdown(true);
                          }}
                          onFocus={() => setShowVesselDropdown(true)}
                          placeholder="Type vessel code or name..."
                          disabled={loading}
                          style={{ backgroundColor: '#fff' }}
                        />
                        {/* Dropdown */}
                        {showVesselDropdown && filteredVessels.length > 0 && (
                          <div className="autocomplete-dropdown">
                            {filteredVessels.map(vessel => (
                              <div
                                key={vessel._id}
                                className="autocomplete-item"
                                onClick={() => handleVesselSelect(vessel)}
                              >
                                <strong>{vessel.code}</strong> — {vessel.name}
                                {vessel.country && <span style={{ marginLeft: '8px', color: '#64748b', fontSize: '0.9em' }}>• {vessel.country}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                        {showVesselDropdown && filteredVessels.length === 0 && vesselSearch && (
                          <div className="autocomplete-dropdown">
                            <div className="autocomplete-item no-result">No vessel found</div>
                          </div>
                        )}
                      </div>

                      {/* Hidden fields to store actual data */}
                      <input type="hidden" name="vesselId" value={formData.vesselId} />
                      
                      <div className="input-group">
                        <label>Vessel Name</label>
                        <input
                          value={formData.vesselName}
                          readOnly
                          disabled
                          style={{ backgroundColor: '#f1f5f9', fontWeight: '600', color: '#1e40af' }}
                        />
                      </div>

                      <div className="input-group">
                        <label>Voyage</label>
                        <input name="voyage" value={formData.voyage} onChange={handleChange} disabled={loading} />
                      </div>
                    </div>
                  </div>

                {/* Loading Vessel */}
                <div className="section">
                  <h3>Loading Vessel</h3>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Port of Departure ID</label>
                      <select name="portDepartureId" value={formData.portDepartureId} onChange={handleChange} disabled={loading}>
                        <option value="">Select Port</option>
                        {seaDestinations.map(port => (
                          <option key={port._id} value={port._id}>{port.code} - {port.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Port of Departure Name</label>
                      <input name="portDepartureName" value={formData.portDepartureName} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Port of Discharge ID</label>
                      <select name="portDischargeId" value={formData.portDischargeId} onChange={handleChange} disabled={loading}>
                        <option value="">Select Port</option>
                        {seaDestinations.map(port => (
                          <option key={port._id} value={port._id}>{port.code} - {port.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Port of Discharge Name</label>
                      <input name="portDischargeName" value={formData.portDischargeName} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Origin Agent ID</label>
                      <select name="originAgentId" value={formData.originAgentId} onChange={handleChange} disabled={loading}>
                        <option value="">Select Agent</option>
                        {customers.map(cust => (
                          <option key={cust._id} value={cust._id}>{cust.code} - {cust.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Origin Agent Name</label>
                      <input name="originAgentName" value={formData.originAgentName} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Carrier ID</label>
                      <select name="carrierId" value={formData.carrierId} onChange={handleChange} disabled={loading}>
                        <option value="">Select Carrier</option>
                        {customers.map(cust => (
                          <option key={cust._id} value={cust._id}>{cust.code} - {cust.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Carrier Name</label>
                      <input name="carrierName" value={formData.carrierName} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Ship Agent ID</label>
                      <select name="shipAgentId" value={formData.shipAgentId} onChange={handleChange} disabled={loading}>
                        <option value="">Select Agent</option>
                        {customers.map(cust => (
                          <option key={cust._id} value={cust._id}>{cust.code} - {cust.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Ship Agent Name</label>
                      <input name="shipAgentName" value={formData.shipAgentName} onChange={handleChange} disabled={loading} />
                    </div>
                  </div>
                </div>

                {/* Final Destination */}
                <div className="section">
                  <h3>Final Destination</h3>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Principle Customer ID</label>
                      <select name="principleCustomerId" value={formData.principleCustomerId} onChange={handleChange} disabled={loading}>
                        <option value="">Select Customer</option>
                        {customers.map(cust => (
                          <option key={cust._id} value={cust._id}>{cust.code} - {cust.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Principle Customer Name</label>
                      <input name="principleCustomerName" value={formData.principleCustomerName} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Local Agent ID</label>
                      <select name="localAgentId" value={formData.localAgentId} onChange={handleChange} disabled={loading}>
                        <option value="">Select Agent</option>
                        {customers.map(cust => (
                          <option key={cust._id} value={cust._id}>{cust.code} - {cust.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Local Agent Name</label>
                      <input name="localAgentName" value={formData.localAgentName} onChange={handleChange} disabled={loading} />
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="section">
                  <h3>Additional Details</h3>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>ETA Date/Time</label>
                      <input type="datetime-local" name="etaDateTime" value={formData.etaDateTime} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Status</label>
                      <select name="status" value={formData.status} onChange={handleChange} disabled={loading}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Loading Voyage</label>
                      <input name="loadingVoyage" value={formData.loadingVoyage} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Last Port ETD</label>
                      <input type="datetime-local" name="lastPortEtd" value={formData.lastPortEtd} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Cargo Category</label>
                      <select name="cargoCategory" value={formData.cargoCategory} onChange={handleChange} disabled={loading}>
                        <option value="FCL">FCL</option>
                        <option value="Console">Console</option>
                        <option value="Co-loads">Co-loads</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Commodity</label>
                      <select name="commodity" value={formData.commodity} onChange={handleChange} disabled={loading}>
                        <option value="General Cargo">General Cargo</option>
                        <option value="Cargo">Cargo</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Currency</label>
                      <select name="currency" value={formData.currency} onChange={handleChange} disabled={loading}>
                        <option value="">Select Currency</option>
                        {currencies.map(curr => (
                          <option key={curr._id} value={curr.code}>{curr.code} - {curr.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Exchange Rate</label>
                      <input type="number" step="0.0001" name="exchangeRate" value={formData.exchangeRate} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Terminal Ref.</label>
                      <input name="terminalRef" value={formData.terminalRef} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Service</label>
                      <input name="service" value={formData.service} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>Terminal</label>
                      <select name="terminal" value={formData.terminal} onChange={handleChange} disabled={loading}>
                        <option value="JCT">JCT</option>
                        <option value="UCT">UCT</option>
                        <option value="SAGT">SAGT</option>
                        <option value="CICT">CICT</option>
                        <option value="CWIT">CWIT</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>SLPA Reference</label>
                      <input name="slpaReference" value={formData.slpaReference} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="input-group">
                      <label>No. of Containers</label>
                      <input type="number" name="numContainers" value={formData.numContainers} onChange={handleChange} disabled={loading} min="0" />
                    </div>
                    <div className="input-group">
                      <label>IMP No.</label>
                      <input name="impNo" value={formData.impNo} onChange={handleChange} disabled={loading} />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-edit" onClick={openEditModal}>
                    Edit Existing
                  </button>

                  <div style={{ flex: 1 }}></div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (isEditMode ? 'Update Job' : 'Add Job')}
                  </button>

                  <button type="button" className="btn-secondary" onClick={handleCancel} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </form>

              {/* Table */}
              <div className="job-table">
                <h3>All Sea Import Jobs</h3>
                {jobs.length === 0 ? (
                  <p className="no-data">No jobs added yet</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Job Num</th>
                        <th>Category</th>
                        <th>Vessel</th>
                        <th>Voyage</th>
                        <th>Status</th>
                        <th>Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map(job => (
                        <tr key={job._id}>
                          <td><strong>{job.jobNum}</strong></td>
                          <td>{job.jobCategory}</td>
                          <td>{job.vesselName}</td>
                          <td>{job.voyage}</td>
                          <td>{job.status}</td>
                          <td>{new Date(job.createdAt).toLocaleDateString()}</td>
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
              <h2>Select Job to Edit</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-search">
              <input
                type="text"
                placeholder="Search by Job Num or Vessel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-list">
              {filtered.length === 0 ? (
                <p className="no-data">No jobs found</p>
              ) : (
                filtered.map(job => (
                  <div key={job._id} className="list-item" onClick={() => selectForEdit(job)}>
                    <div>
                      <strong>{job.jobNum}</strong> - {job.vesselName} ({job.jobCategory})
                      <br />
                      <small>{job.portDischargeName} • {job.status}</small>
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

export default JobMasterImport;