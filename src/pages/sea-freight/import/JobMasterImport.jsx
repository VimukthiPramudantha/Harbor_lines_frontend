import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../../components/layout/Sidebar.jsx';
import Navbar from '../../../components/layout/Navbar.jsx';
import toast from 'react-hot-toast';
import '../../../styles/JobMasterImport.css';
import PortOfLoadingInfo from './PortOfLoadingInfo.jsx';

const API_BASE = 'http://localhost:5000/api/jobs/sea-import';
const DRAFT_KEY = 'importJobDraft_v1';

const JobMasterImport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentStep, setCurrentStep] = useState(1); 

  const [currencies, setCurrencies] = useState([]);
  const [seaDestinations, setSeaDestinations] = useState([]);
  const [customerSuppliers, setCustomerSuppliers] = useState([]);
  const [vessels, setVessels] = useState([]);

  const [vesselSearch, setVesselSearch] = useState('');
  const [showVesselDropdown, setShowVesselDropdown] = useState(false);

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

  const [principleCustomerSearch, setPrincipleCustomerSearch] = useState('');
  const [showPrincipleCustomerDropdown, setShowPrincipleCustomerDropdown] = useState(false);

  const [localAgentSearch, setLocalAgentSearch] = useState('');
  const [showLocalAgentDropdown, setShowLocalAgentDropdown] = useState(false);

  const [portOfLoadingSearch, setPortOfLoadingSearch] = useState('');
  const [showPortOfLoadingDropdown, setShowPortOfLoadingDropdown] = useState(false);

  const initialForm = {
    jobNum: '',
    jobDate: new Date().toISOString().slice(0, 10),
    finalizeDate: new Date().toISOString().slice(0, 10),
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
    impNo: '',
    portOfLoadingId: '',
    portOfLoadingName: '',
    mblNumber: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const jobCategories = ['SOC', 'Freight Forwarding', 'Car Carrier', 'Casual Caller', 'Transhipment', 'Main Line', 'FF + Clearing', 'NVOCC'];
  const cargoCategories = ['Console', 'Co-loads', 'FCL'];
  const commodities = ['Cargo', 'General Cargo'];
  const terminals = ['JCT', 'UCT', 'SAGT', 'CICT', 'CWIT'];

  useEffect(() => {
    const savedSidebar = localStorage.getItem('sidebarOpen');
    if (savedSidebar !== null) setSidebarOpen(JSON.parse(savedSidebar));

    fetchJobs();
    fetchCurrencies();
    fetchSeaDestinations();
    fetchCustomerSuppliers();
    fetchVessels();
    generateJobNumber();

    const draft = sessionStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(prev => ({ ...initialForm, ...parsed }));
        if (parsed.vesselName) setVesselSearch(parsed.vesselName);
        if (parsed.portOfLoadingName) setPortOfLoadingSearch(parsed.portOfLoadingName);
      } catch (err) {
        console.warn('Failed to parse draft', err);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      } catch (err) {
        console.warn('Could not save draft', err);
      }
    }
  }, [formData, loading]);

  const generateJobNumber = async () => {
    if (isEditMode) return;
    try {
      const res = await fetch(`${API_BASE}/getAllJobs`);
      const data = await res.json();
      if (data.success) {
        const count = data.data.length;
        const nextNum = String(count + 1).padStart(3, '0');
        setFormData(prev => ({ ...prev, jobNum: `HBL/IMP/${nextNum}` }));
      }
    } catch (err) {
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

  const fetchCustomerSuppliers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/customersuppliers/getAllCustomerSuppliers');
      const data = await res.json();
      if (data.success) setCustomerSuppliers(data.data);
    } catch (err) {
      toast.error('Failed to load agents & carriers');
    }
  };

  const fetchVessels = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/vessels/getAllVessels');
      const data = await res.json();
      if (data.success) setVessels(data.data);
    } catch (err) {
      toast.error('Failed to load vessels');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jobNum') return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // === AUTO-SUGGEST HANDLERS ===
  const handleVesselSelect = (vessel) => {
    setFormData(prev => ({ ...prev, vesselId: vessel._id, vesselName: vessel.name }));
    setVesselSearch(`${vessel.code} - ${vessel.name}`);
    setShowVesselDropdown(false);
  };

  const handlePortDepartureSelect = (port) => {
    setFormData(prev => ({ ...prev, portDepartureId: port._id, portDepartureName: port.name }));
    setPortDepartureSearch(`${port.code} - ${port.name}`);
    setShowPortDepartureDropdown(false);
  };

  const handlePortDischargeSelect = (port) => {
    setFormData(prev => ({ ...prev, portDischargeId: port._id, portDischargeName: port.name }));
    setPortDischargeSearch(`${port.code} - ${port.name}`);
    setShowPortDischargeDropdown(false);
  };

  const handleOriginAgentSelect = (agent) => {
    setFormData(prev => ({ ...prev, originAgentId: agent._id, originAgentName: agent.name }));
    setOriginAgentSearch(`${agent.code} - ${agent.name}`);
    setShowOriginAgentDropdown(false);
  };

  const handleCarrierSelect = (carrier) => {
    setFormData(prev => ({ ...prev, carrierId: carrier._id, carrierName: carrier.name }));
    setCarrierSearch(`${carrier.code} - ${carrier.name}`);
    setShowCarrierDropdown(false);
  };

  const handleShipAgentSelect = (agent) => {
    setFormData(prev => ({ ...prev, shipAgentId: agent._id, shipAgentName: agent.name }));
    setShipAgentSearch(`${agent.code} - ${agent.name}`);
    setShowShipAgentDropdown(false);
  };

  const handlePrincipleCustomerSelect = (cust) => {
    setFormData(prev => ({ ...prev, principleCustomerId: cust._id, principleCustomerName: cust.name }));
    setPrincipleCustomerSearch(`${cust.code} - ${cust.name}`);
    setShowPrincipleCustomerDropdown(false);
  };

  const handleLocalAgentSelect = (agent) => {
    setFormData(prev => ({ ...prev, localAgentId: agent._id, localAgentName: agent.name }));
    setLocalAgentSearch(`${agent.code} - ${agent.name}`);
    setShowLocalAgentDropdown(false);
  };

  const handlePortOfLoadingSelect = (port) => {
    setFormData(prev => ({ ...prev, portOfLoadingId: port._id, portOfLoadingName: port.name }));
    setPortOfLoadingSearch(`${port.code} - ${port.name}`);
    setShowPortOfLoadingDropdown(false);
  };

  // Define filteredVessels (fixes the blank page bug)
  const filteredVessels = vessels.filter(v =>
    `${v.code} ${v.name}`.toLowerCase().includes(vesselSearch.toLowerCase())
  );

  // === STEP NAVIGATION & VALIDATION ===
  const handleStep1Next = () => {
    // Minimal validation for Step 1: require vessel, port departure, port discharge
    if (!formData.vesselId) {
      toast.error('Please select a Vessel before continuing.');
      return;
    }
    if (!formData.portDepartureId) {
      toast.error('Please select Port of Departure before continuing.');
      return;
    }
    if (!formData.portDischargeId) {
      toast.error('Please select Port of Discharge before continuing.');
      return;
    }

    // Save (already autosaved) but ensure sessionStorage has the latest
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch (err) {
      console.warn('Could not save draft', err);
    }

    setCurrentStep(2);
  };

  // FINAL SAVE - Only called from Step 2
  const handleFinalSave = async () => {
    if (!formData.portOfLoadingId || !formData.mblNumber) {
      toast.error('Port of Loading and MBL Number are required!');
      return;
    }

    setLoading(true);

    const url = isEditMode ? `${API_BASE}/updateJob/${editingId}` : `${API_BASE}/createJob`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed');
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed');

      await fetchJobs();
      toast.success(isEditMode ? 'Job updated!' : 'Job created successfully!');

      // Reset form & go back to Step 1
      generateJobNumber();
      setFormData(initialForm);
      sessionStorage.removeItem(DRAFT_KEY);
      setCurrentStep(1);
      setIsEditMode(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create/update job');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    generateJobNumber();
    setFormData(initialForm);
    sessionStorage.removeItem(DRAFT_KEY);
    setCurrentStep(1);
    setIsEditMode(false);
    setEditingId(null);
    setVesselSearch('');
    setPortDepartureSearch('');
    setPortDischargeSearch('');
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
    // set step to 1 so user can edit main data first
    setCurrentStep(1);
  };

  const filtered = jobs.filter(j =>
    j.jobNum.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

            {/* WIZARD STEPS */}
            <div className="wizard-steps">
              <div className={`step-indicator ${currentStep === 1 ? 'active' : 'completed'}`}>
                1. Job Details
              </div>
              <div className={`step-indicator ${currentStep === 2 ? 'active' : ''}`}>
                2. Port of Loading
              </div>
            </div>

            <div className="job-card">
              <form className="job-form" onSubmit={(e) => e.preventDefault()}>

                {/* STEP 1: MAIN JOB FORM */}
                {currentStep === 1 && (
                  <>
                    {/* Job Information */}
                    <div className="section">
                      <h3>Job Information</h3>
                      <div className="form-grid">
                        <div className="input-group">
                          <label>Job Num <span className="required">*</span></label>
                          <input value={formData.jobNum} readOnly disabled style={{ backgroundColor: '#f1f5f9', fontWeight: 'bold', color: '#1e40af' }} />
                          <small style={{ color: '#64748b' }}>Auto-generated</small>
                        </div>
                        <div className="input-group">
                          <label>Job Date <span className="required">*</span></label>
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
                          <label>Category <span className="required">*</span></label>
                          <select name="jobCategory" value={formData.jobCategory} onChange={handleChange} disabled={loading}>
                            {jobCategories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Vessel Information */}
                    <div className="section">
                      <h3>Vessel Information</h3>
                      <div className="form-grid">
                        <div className="input-group" style={{ position: 'relative' }}>
                          <label>Vessel <span className="required">*</span></label>
                          <input
                            type="text"
                            value={vesselSearch}
                            onChange={(e) => { setVesselSearch(e.target.value); setShowVesselDropdown(true); }}
                            onFocus={() => setShowVesselDropdown(true)}
                            placeholder="Type vessel code or name..."
                            disabled={loading}
                          />
                          {showVesselDropdown && filteredVessels.length > 0 && (
                            <div className="autocomplete-dropdown">
                              {filteredVessels.map(vessel => (
                                <div
                                  key={vessel._id}
                                  className="autocomplete-item"
                                  onClick={() => handleVesselSelect(vessel)}
                                >
                                  <strong>{vessel.code}</strong> — {vessel.name}
                                  {vessel.country && <span style={{ marginLeft: '8px', color: '#64748b' }}>• {vessel.country}</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <input type="hidden" name="vesselId" value={formData.vesselId} />
                        <div className="input-group">
                          <label>Vessel Name</label>
                          <input value={formData.vesselName} readOnly disabled style={{ backgroundColor: '#f0fdf4', color: '#166534', fontWeight: '600' }} />
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
                        {/* Port of Departure */}
                        <div className="input-group" style={{ position: 'relative' }}>
                          <label>Port of Departure <span className="required">*</span></label>
                          <input type="text" value={portDepartureSearch} onChange={(e) => { setPortDepartureSearch(e.target.value); setShowPortDepartureDropdown(true); }} onFocus={() => setShowPortDepartureDropdown(true)} placeholder="Type port code or name..." disabled={loading} />
                          {showPortDepartureDropdown && (
                            <div className="autocomplete-dropdown">
                              {seaDestinations.filter(p => p.code.toLowerCase().includes(portDepartureSearch.toLowerCase()) || p.name.toLowerCase().includes(portDepartureSearch.toLowerCase()))
                                .map(port => (
                                  <div key={port._id} className="autocomplete-item" onClick={() => handlePortDepartureSelect(port)}>
                                    <strong>{port.code}</strong> — {port.name}
                                  </div>
                                ))
                              }
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
                          <input type="text" value={portDischargeSearch} onChange={(e) => { setPortDischargeSearch(e.target.value); setShowPortDischargeDropdown(true); }} onFocus={() => setShowPortDischargeDropdown(true)} placeholder="Type port code or name..." disabled={loading} />
                          {showPortDischargeDropdown && (
                            <div className="autocomplete-dropdown">
                              {seaDestinations.filter(p => p.code.toLowerCase().includes(portDischargeSearch.toLowerCase()) || p.name.toLowerCase().includes(portDischargeSearch.toLowerCase()))
                                .map(port => (
                                  <div key={port._id} className="autocomplete-item" onClick={() => handlePortDischargeSelect(port)}>
                                    <strong>{port.code}</strong> — {port.name}
                                  </div>
                                ))
                              }
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
                          <input type="text" value={originAgentSearch} onChange={(e) => { setOriginAgentSearch(e.target.value); setShowOriginAgentDropdown(true); }} onFocus={() => setShowOriginAgentDropdown(true)} placeholder="Type code or name..." disabled={loading} />
                          {showOriginAgentDropdown && (
                            <div className="autocomplete-dropdown">
                              {customerSuppliers.filter(c => c.code.toLowerCase().includes(originAgentSearch.toLowerCase()) || c.name.toLowerCase().includes(originAgentSearch.toLowerCase()))
                                .map(agent => (
                                  <div key={agent._id} className="autocomplete-item" onClick={() => handleOriginAgentSelect(agent)}>
                                    <strong>{agent.code}</strong> — {agent.name}
                                    <span style={{ marginLeft: '12px', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                                      {agent.type.toUpperCase()}
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                        <div className="input-group">
                          <label>Origin Agent Name</label>
                          <input value={formData.originAgentName} readOnly disabled style={{ backgroundColor: '#fefce8', color: '#854d0e', fontWeight: '600' }} />
                        </div>

                        {/* Carrier */}
                        <div className="input-group" style={{ position: 'relative' }}>
                          <label>Carrier</label>
                          <input type="text" value={carrierSearch} onChange={(e) => { setCarrierSearch(e.target.value); setShowCarrierDropdown(true); }} onFocus={() => setShowCarrierDropdown(true)} placeholder="Type code or name..." disabled={loading} />
                          {showCarrierDropdown && (
                            <div className="autocomplete-dropdown">
                              {customerSuppliers.filter(c => c.code.toLowerCase().includes(carrierSearch.toLowerCase()) || c.name.toLowerCase().includes(carrierSearch.toLowerCase()))
                                .map(carrier => (
                                  <div key={carrier._id} className="autocomplete-item" onClick={() => handleCarrierSelect(carrier)}>
                                    <strong>{carrier.code}</strong> — {carrier.name}
                                    <span style={{ marginLeft: '12px', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                                      {carrier.type.toUpperCase()}
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                        <div className="input-group">
                          <label>Carrier Name</label>
                          <input value={formData.carrierName} readOnly disabled style={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '600' }} />
                        </div>

                        {/* Ship Agent */}
                        <div className="input-group" style={{ position: 'relative' }}>
                          <label>Ship Agent</label>
                          <input type="text" value={shipAgentSearch} onChange={(e) => { setShipAgentSearch(e.target.value); setShowShipAgentDropdown(true); }} onFocus={() => setShowShipAgentDropdown(true)} placeholder="Type code or name..." disabled={loading} />
                          {showShipAgentDropdown && (
                            <div className="autocomplete-dropdown">
                              {customerSuppliers.filter(c => c.code.toLowerCase().includes(shipAgentSearch.toLowerCase()) || c.name.toLowerCase().includes(shipAgentSearch.toLowerCase()))
                                .map(agent => (
                                  <div key={agent._id} className="autocomplete-item" onClick={() => handleShipAgentSelect(agent)}>
                                    <strong>{agent.code}</strong> — {agent.name}
                                    <span style={{ marginLeft: '12px', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                                      {agent.type.toUpperCase()}
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                        <div className="input-group">
                          <label>Ship Agent Name</label>
                          <input value={formData.shipAgentName} readOnly disabled style={{ backgroundColor: '#fdf2f3', color: '#7c2d12', fontWeight: '600' }} />
                        </div>
                      </div>
                    </div>

                    {/* Final Destination */}
                    <div className="section">
                      <h3>Final Destination</h3>
                      <div className="form-grid">
                        <div className="input-group" style={{ position: 'relative' }}>
                          <label>Principle Customer</label>
                          <input type="text" value={principleCustomerSearch} onChange={(e) => { setPrincipleCustomerSearch(e.target.value); setShowPrincipleCustomerDropdown(true); }} onFocus={() => setShowPrincipleCustomerDropdown(true)} placeholder="Type code or name..." disabled={loading} />
                          {showPrincipleCustomerDropdown && (
                            <div className="autocomplete-dropdown">
                              {customerSuppliers.filter(c => c.code.toLowerCase().includes(principleCustomerSearch.toLowerCase()) || c.name.toLowerCase().includes(principleCustomerSearch.toLowerCase()))
                                .map(cust => (
                                  <div key={cust._id} className="autocomplete-item" onClick={() => handlePrincipleCustomerSelect(cust)}>
                                    <strong>{cust.code}</strong> — {cust.name}
                                    <span style={{ marginLeft: '12px', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                                      {cust.type.toUpperCase()}
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                        <div className="input-group">
                          <label>Principle Customer Name</label>
                          <input value={formData.principleCustomerName} readOnly disabled style={{ backgroundColor: '#ecfdf5', color: '#065f46', fontWeight: '600' }} />
                        </div>

                        <div className="input-group" style={{ position: 'relative' }}>
                          <label>Local Agent</label>
                          <input type="text" value={localAgentSearch} onChange={(e) => { setLocalAgentSearch(e.target.value); setShowLocalAgentDropdown(true); }} onFocus={() => setShowLocalAgentDropdown(true)} placeholder="Type code or name..." disabled={loading} />
                          {showLocalAgentDropdown && (
                            <div className="autocomplete-dropdown">
                              {customerSuppliers.filter(c => c.code.toLowerCase().includes(localAgentSearch.toLowerCase()) || c.name.toLowerCase().includes(localAgentSearch.toLowerCase()))
                                .map(agent => (
                                  <div key={agent._id} className="autocomplete-item" onClick={() => handleLocalAgentSelect(agent)}>
                                    <strong>{agent.code}</strong> — {agent.name}
                                    <span style={{ marginLeft: '12px', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                                      {agent.type.toUpperCase()}
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                        <div className="input-group">
                          <label>Local Agent Name</label>
                          <input value={formData.localAgentName} readOnly disabled style={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '600' }} />
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
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

                    {/* NAVIGATION */}
                    <div className="form-actions">
                      <button type="button" className="btn-edit" onClick={openEditModal}>
                        Edit Existing
                      </button>
                      <div style={{ flex: 1 }}></div>
                      <button type="button" className="btn-primary" onClick={handleStep1Next}>
                        Next: Port of Loading →
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 2: PORT OF LOADING (external component) */}
                {currentStep === 2 && (
                  <PortOfLoadingInfo
                    formData={formData}
                    setFormData={setFormData}
                    onPrevious={() => setCurrentStep(1)}
                    onNext={handleFinalSave}
                  />
                )}
              </form>

              {/* Job Table */}
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
                        <th>Port of Loading</th>
                        <th>MBL</th>
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
                          <td>{job.portOfLoadingName || '-'}</td>
                          <td>{job.mblNumber || '-'}</td>
                          <td>{job.status}</td>
                          <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-'}</td>
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

export default JobMasterImport;