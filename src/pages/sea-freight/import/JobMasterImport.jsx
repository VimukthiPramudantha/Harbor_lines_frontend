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

  // Auto-suggest states for Loading Vessel
const [portDepartureSearch, setPortDepartureSearch] = useState('');
const [showPortDepartureDropdown, setShowPortDepartureDropdown] = useState(false);

const [portDischargeSearch, setPortDischargeSearch] = useState('');
const [showPortDischargeDropdown, setShowPortDischargeDropdown] = useState(false);

const [originAgentSearch, setOriginAgentSearch] = useState('');
const [showOriginAgentDropdown, setShowOriginAgentDropdown] = useState(false);

const [carrierSearch, setCarrierSearch] = useState('');
const [showCarrierDropdown, setShowCarrierDropdown] = useState(false);

const [shipAgentSearch, setShipAgentSearch] = useState('');
const [showShipAgentDropdown, setShowShipAgentDropdown] = useState(false);

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

// Port of Departure
const handlePortDepartureSelect = (port) => {
  setFormData(prev => ({
    ...prev,
    portDepartureId: port._id,
    portDepartureName: port.name
  }));
  setPortDepartureSearch(`${port.code} - ${port.name}`);
  setShowPortDepartureDropdown(false);
};

// Port of Discharge
const handlePortDischargeSelect = (port) => {
  setFormData(prev => ({
    ...prev,
    portDischargeId: port._id,
    portDischargeName: port.name
  }));
  setPortDischargeSearch(`${port.code} - ${port.name}`);
  setShowPortDischargeDropdown(false);
};

// Origin Agent
const handleOriginAgentSelect = (agent) => {
  setFormData(prev => ({
    ...prev,
    originAgentId: agent._id,
    originAgentName: agent.name
  }));
  setOriginAgentSearch(`${agent.code} - ${agent.name}`);
  setShowOriginAgentDropdown(false);
};

// Carrier
const handleCarrierSelect = (carrier) => {
  setFormData(prev => ({
    ...prev,
    carrierId: carrier._id,
    carrierName: carrier.name
  }));
  setCarrierSearch(`${carrier.code} - ${carrier.name}`);
  setShowCarrierDropdown(false);
};

// Ship Agent
const handleShipAgentSelect = (agent) => {
  setFormData(prev => ({
    ...prev,
    shipAgentId: agent._id,
    shipAgentName: agent.name
  }));
  setShipAgentSearch(`${agent.code} - ${agent.name}`);
  setShowShipAgentDropdown(false);
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

               {/* Vessel Information*/}
                  <div className="section">
                    <h3>Vessel Information</h3>
                    <div className="form-grid">
                      <div className="input-group" style={{ position: 'relative' }}>
                        <label>Vessel <span className="required"></span></label>
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

               {/* Loading Vessel - AUTO SUGGEST FOR ALL 5 FIELDS */}
                  <div className="section">
                    <h3>Loading Vessel</h3>
                    <div className="form-grid">

                      {/* Port of Departure */}
                      <div className="input-group" style={{ position: 'relative' }}>
                        <label>Port of Departure <span className="required">*</span></label>
                        <input
                          type="text"
                          value={portDepartureSearch}
                          onChange={(e) => {
                            setPortDepartureSearch(e.target.value);
                            setShowPortDepartureDropdown(true);
                          }}
                          onFocus={() => setShowPortDepartureDropdown(true)}
                          placeholder="Type port code or name..."
                          disabled={loading}
                        />
                        {showPortDepartureDropdown && (
                          <div className="autocomplete-dropdown">
                            {seaDestinations
                              .filter(p => 
                                p.code.toLowerCase().includes(portDepartureSearch.toLowerCase()) ||
                                p.name.toLowerCase().includes(portDepartureSearch.toLowerCase())
                              )
                              .map(port => (
                                <div
                                  key={port._id}
                                  className="autocomplete-item"
                                  onClick={() => handlePortDepartureSelect(port)}
                                >
                                  <strong>{port.code}</strong> — {port.name}
                                </div>
                              ))
                            }
                            {showPortDepartureDropdown && seaDestinations.filter(p => 
                              p.code.toLowerCase().includes(portDepartureSearch.toLowerCase()) ||
                              p.name.toLowerCase().includes(portDepartureSearch.toLowerCase())
                            ).length === 0 && (
                              <div className="autocomplete-item no-result">No port found</div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="input-group">
                        <label>Port of Departure Name</label>
                        <input value={formData.portDepartureName} readOnly disabled style={{ backgroundColor: '#f0fdf4', color: '#166534', fontWeight: '600' }} />
                      </div>

                      {/* Port of Discharge */}
                      <div className="input-group" style={{ position: 'relative' }}>
                        <label>Port of Discharge <span className="required">*</span></label>
                        <input
                          type="text"
                          value={portDischargeSearch}
                          onChange={(e) => {
                            setPortDischargeSearch(e.target.value);
                            setShowPortDischargeDropdown(true);
                          }}
                          onFocus={() => setShowPortDischargeDropdown(true)}
                          placeholder="Type port code or name..."
                          disabled={loading}
                        />
                        {showPortDischargeDropdown && (
                          <div className="autocomplete-dropdown">
                            {seaDestinations
                              .filter(p => 
                                p.code.toLowerCase().includes(portDischargeSearch.toLowerCase()) ||
                                p.name.toLowerCase().includes(portDischargeSearch.toLowerCase())
                              )
                              .map(port => (
                                <div
                                  key={port._id}
                                  className="autocomplete-item"
                                  onClick={() => handlePortDischargeSelect(port)}
                                >
                                  <strong>{port.code}</strong> — {port.name}
                                </div>
                              ))
                            }
                            {showPortDischargeDropdown && seaDestinations.filter(p => 
                              p.code.toLowerCase().includes(portDischargeSearch.toLowerCase()) ||
                              p.name.toLowerCase().includes(portDischargeSearch.toLowerCase())
                            ).length === 0 && (
                              <div className="autocomplete-item no-result">No port found</div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="input-group">
                        <label>Port of Discharge Name</label>
                        <input value={formData.portDischargeName} readOnly disabled style={{ backgroundColor: '#f0fdf4', color: '#166534', fontWeight: '600' }} />
                      </div>

                      {/* Origin Agent */}
                      <div className="input-group" style={{ position: 'relative' }}>
                        <label>Origin Agent</label>
                        <input
                          type="text"
                          value={originAgentSearch}
                          onChange={(e) => {
                            setOriginAgentSearch(e.target.value);
                            setShowOriginAgentDropdown(true);
                          }}
                          onFocus={() => setShowOriginAgentDropdown(true)}
                          placeholder="Type agent code or name..."
                          disabled={loading}
                        />
                        {showOriginAgentDropdown && (
                          <div className="autocomplete-dropdown">
                            {customers
                              .filter(c => 
                                c.code.toLowerCase().includes(originAgentSearch.toLowerCase()) ||
                                c.name.toLowerCase().includes(originAgentSearch.toLowerCase())
                              )
                              .map(agent => (
                                <div
                                  key={agent._id}
                                  className="autocomplete-item"
                                  onClick={() => handleOriginAgentSelect(agent)}
                                >
                                  <strong>{agent.code}</strong> — {agent.name}
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>

                      <div className="input-group">
                        <label>Origin Agent Name</label>
                        <input value={formData.originAgentName} readOnly disabled />
                      </div>

                      {/* Carrier */}
                      <div className="input-group" style={{ position: 'relative' }}>
                        <label>Carrier</label>
                        <input
                          type="text"
                          value={carrierSearch}
                          onChange={(e) => {
                            setCarrierSearch(e.target.value);
                            setShowCarrierDropdown(true);
                          }}
                          onFocus={() => setShowCarrierDropdown(true)}
                          placeholder="Type carrier code or name..."
                          disabled={loading}
                        />
                        {showCarrierDropdown && (
                          <div className="autocomplete-dropdown">
                            {customers
                              .filter(c => 
                                c.code.toLowerCase().includes(carrierSearch.toLowerCase()) ||
                                c.name.toLowerCase().includes(carrierSearch.toLowerCase())
                              )
                              .map(carrier => (
                                <div
                                  key={carrier._id}
                                  className="autocomplete-item"
                                  onClick={() => handleCarrierSelect(carrier)}
                                >
                                  <strong>{carrier.code}</strong> — {carrier.name}
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>

                      <div className="input-group">
                        <label>Carrier Name</label>
                        <input value={formData.carrierName} readOnly disabled style={{ fontWeight: '600' }} />
                      </div>

                      {/* Ship Agent */}
                      <div className="input-group" style={{ position: 'relative' }}>
                        <label>Ship Agent</label>
                        <input
                          type="text"
                          value={shipAgentSearch}
                          onChange={(e) => {
                            setShipAgentSearch(e.target.value);
                            setShowShipAgentDropdown(true);
                          }}
                          onFocus={() => setShowShipAgentDropdown(true)}
                          placeholder="Type agent code or name..."
                          disabled={loading}
                        />
                        {showShipAgentDropdown && (
                          <div className="autocomplete-dropdown">
                            {customers
                              .filter(c => 
                                c.code.toLowerCase().includes(shipAgentSearch.toLowerCase()) ||
                                c.name.toLowerCase().includes(shipAgentSearch.toLowerCase())
                              )
                              .map(agent => (
                                <div
                                  key={agent._id}
                                  className="autocomplete-item"
                                  onClick={() => handleShipAgentSelect(agent)}
                                >
                                  <strong>{agent.code}</strong> — {agent.name}
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>

                      <div className="input-group">
                        <label>Ship Agent Name</label>
                        <input value={formData.shipAgentName} readOnly disabled style={{  fontWeight: '600' }} />
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