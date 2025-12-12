// frontend/src/pages/sea-freight/import/delivery-order/DeliveryOrder.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../../../../components/layout/Sidebar.jsx';
import Navbar from '../../../../components/layout/Navbar.jsx';
import toast from 'react-hot-toast';
import '../../../../styles/DeliveryOrder.css';

const API_BASE = 'http://localhost:5000/api/jobs/sea-import';

const DeliveryOrder = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Job selection & data
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobSearch, setJobSearch] = useState('');
  const [showJobDropdown, setShowJobDropdown] = useState(false);

  const [formData, setFormData] = useState({
    jobNum: '',
    etaDateTime: '',
    lastPortEtd: '',
    houseBl: '',
    masterBlNumber: '',
    masterBlSerial: '',
    houseBlSerial: '',
    vesselCode: '',
    vesselName: '',
    voyage: '',
    fclLcl: 'FCL',
    doNum: '',
    doType: 'Custom Copy',
    numContainers: '',
    deStuffRequired: false
  });

  const doTypes = ['Custom Copy', 'SLPA 1', 'SLPA 2', 'SLPA 3'];

  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) setSidebarOpen(JSON.parse(saved));
    fetchJobs();
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/getAllJobs`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (err) {
      toast.error('Failed to load jobs');
    }
  };

  // When user selects a job → auto-fill all fields
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setFormData({
      jobNum: job.jobNum,
      etaDateTime: job.etaDateTime ? new Date(job.etaDateTime).toISOString().slice(0, 16) : '',
      lastPortEtd: job.lastPortEtd ? new Date(job.lastPortEtd).toISOString().slice(0, 16) : '',
      houseBl: '',
      masterBlNumber: job.mblNumber || '',
      masterBlSerial: '',
      houseBlSerial: '',
      vesselCode: job.vesselId?.code || '',
      vesselName: job.vesselName || '',
      voyage: job.voyage || '',
      fclLcl: job.cargoCategory === 'FCL' ? 'FCL' : 'LCL',
      doNum: ''
      doType: 'Custom Copy',
      numContainers: job.containers?.length || job.numContainers || '',
      deStuffRequired: false 
    });
    setJobSearch(`${job.jobNum} — ${job.vesselName} (${job.voyage})`);
    setShowJobDropdown(false);
    toast.success(`Job ${job.jobNum} loaded successfully!`);
  };

  // Filter jobs for search
  const filteredJobs = jobs.filter(job =>
    job.jobNum.toLowerCase().includes(jobSearch.toLowerCase()) ||
    job.vesselName?.toLowerCase().includes(jobSearch.toLowerCase()) ||
    job.mblNumber?.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (!selectedJob) {
      toast.error('Please select a job first');
      return;
    }
    if (!formData.houseBl) {
      toast.error('House BL is required');
      return;
    }
    if (!formData.doType) {
      toast.error('Please select DO Type');
      return;
    }
    setCurrentStep(2);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="page-content">
          <div className="page-wrapper">
            <div className="page-header">
              <h1 className="page-title">Delivery Order Creation</h1>
              <p className="page-subtitle">Create DO for Sea Import Job</p>
            </div>

            {/* Wizard Steps */}
            <div className="wizard-steps">
              <div className={`step-indicator ${currentStep === 1 ? 'active' : 'completed'}`}>
                1. Job Information
              </div>
              <div className={`step-indicator ${currentStep === 2 ? 'active' : ''}`}>
                2. Container Selection
              </div>
              <div className={`step-indicator ${currentStep === 3 ? 'active' : ''}`}>
                3. Charges
              </div>
              <div className={`step-indicator ${currentStep === 4 ? 'active' : ''}`}>
                4. Preview & Submit
              </div>
            </div>

            <div className="job-card">
              {currentStep === 1 && (
                <div className="section">
                  <h3>Step 1: Job Information</h3>

                  {/* Job Selection */}
                  <div className="input-group" style={{ position: 'relative', marginBottom: '2rem' }}>
                    <label>Select Job <span className="required">*</span></label>
                    <input
                      type="text"
                      value={jobSearch}
                      onChange={(e) => {
                        setJobSearch(e.target.value);
                        setShowJobDropdown(true);
                      }}
                      onFocus={() => setShowJobDropdown(true)}
                      placeholder="Search by Job No, Vessel, or MBL..."
                      style={{ fontSize: '1.1rem', padding: '1rem' }}
                    />
                    {showJobDropdown && (
                      <div className="autocomplete-dropdown" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {filteredJobs.length === 0 ? (
                          <div className="autocomplete-item no-result">No jobs found</div>
                        ) : (
                          filteredJobs.map(job => (
                            <div
                              key={job._id}
                              className="autocomplete-item"
                              onClick={() => handleJobSelect(job)}
                              style={{ padding: '1rem' }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>{job.jobNum}</strong>
                                <span style={{ color: '#3b82f6' }}>{job.vesselName}</span>
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
                                Voyage: {job.voyage} • MBL: {job.mblNumber || '—'} •
                                POL: {job.portOfLoadingName || '—'} •
                                Containers: {job.containers?.length || 0}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {selectedJob && (
                    <div className="form-grid">
                      <div className="input-group">
                        <label>Job Number</label>
                        <input value={formData.jobNum} readOnly disabled style={{ backgroundColor: '#f0fdf4', fontWeight: 'bold', color: '#166534' }} />
                      </div>

                      <div className="input-group">
                        <label>ETA Date/Time</label>
                        <input type="datetime-local" name="etaDateTime" value={formData.etaDateTime} onChange={handleChange} disabled={loading} />
                      </div>

                      <div className="input-group">
                        <label>Last Port ETD</label>
                        <input type="datetime-local" name="lastPortEtd" value={formData.lastPortEtd} onChange={handleChange} disabled={loading} />
                      </div>

                      <div className="input-group">
                        <label>House BL <span className="required">*</span></label>
                        <input name="houseBl" value={formData.houseBl} onChange={handleChange} placeholder="e.g. COL/HBL/001" disabled={loading} />
                      </div>

                      <div className="input-group">
                        <label>Master BL Number</label>
                        <input value={formData.masterBlNumber} readOnly disabled style={{ backgroundColor: '#fefce8' }} />
                      </div>

                      <div className="input-group">
                        <label>Master BL Serial</label>
                        <input name="masterBlSerial" value={formData.masterBlSerial} onChange={handleChange} disabled={loading} />
                      </div>

                      <div className="input-group">
                        <label>House BL Serial</label>
                        <input name="houseBlSerial" value={formData.houseBlSerial} onChange={handleChange} disabled={loading} />
                      </div>

                      <div className="input-group">
                        <label>Vessel Code</label>
                        <input value={formData.vesselCode} readOnly disabled style={{ backgroundColor: '#f0fdf4' }} />
                      </div>

                      <div className="input-group">
                        <label>Vessel Name</label>
                        <input value={formData.vesselName} readOnly disabled style={{ backgroundColor: '#f0fdf4', fontWeight: '600' }} />
                      </div>

                      <div className="input-group">
                        <label>Voyage</label>
                        <input value={formData.voyage} readOnly disabled style={{ backgroundColor: '#f0fdf4' }} />
                      </div>

                      <div className="input-group">
                        <label>FCL or LCL</label>
                        <input value={formData.fclLcl} readOnly disabled style={{ backgroundColor: '#fef3c7' }} />
                      </div>

                      <div className="input-group">
                        <label>DO Number</label>
                        <input value="(Auto-generated)" readOnly disabled style={{ backgroundColor: '#f1f5f9', fontStyle: 'italic' }} />
                        <small style={{ color: '#64748b' }}>Will be generated on final save</small>
                      </div>

                      <div className="input-group">
                        <label>DO Type <span className="required">*</span></label>
                        <select name="doType" value={formData.doType} onChange={handleChange} disabled={loading}>
                          {doTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="input-group">
                        <label>No. of Containers</label>
                        <input value={formData.numContainers} readOnly disabled style={{ backgroundColor: '#ecfdf5', fontWeight: '600' }} />
                      </div>

                      <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '14px',
                          fontSize: '1.15rem',
                          fontWeight: '600',
                          color: formData.deStuffRequired ? '#dc2626' : '#1e293b',
                          marginTop: '1.5rem'
                        }}>
                          <input
                            type="checkbox"
                            name="deStuffRequired"
                            checked={formData.deStuffRequired}
                            onChange={handleChange}
                            style={{
                              width: '28px',
                              height: '28px',
                              accentColor: '#dc2626',
                              cursor: 'pointer'
                            }}
                          />
                          <div>
                            De-Stuff Required
                            {formData.deStuffRequired && (
                              <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#991b1b' }}>
                                (Containers will be emptied)
                              </span>
                            )}
                          </div>
                        </label>
                        {!formData.deStuffRequired && (
                          <small style={{ color: '#64748b', marginLeft: '42px' }}>
                            Default: Direct delivery
                          </small>
                        )}
                      </div>

                    </div>
                  )}

                  <div className="form-actions" style={{ marginTop: '3rem' }}>
                    <button type="button" className="btn-primary" onClick={handleNext} disabled={!selectedJob}>
                      Next: Select Containers
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrder;