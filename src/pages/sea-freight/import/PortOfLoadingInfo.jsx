import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const PortOfLoadingInfo = ({ formData, setFormData, onNext, onPrevious }) => {
  const [loading, setLoading] = useState(false);
  const [seaDestinations, setSeaDestinations] = useState([]);

  // Auto-suggest states
  const [portSearch, setPortSearch] = useState(formData.portOfLoadingName || '');
  const [showPortDropdown, setShowPortDropdown] = useState(false);

  useEffect(() => {
    fetchSeaDestinations();
    // initialize local portSearch from formData if present
    setPortSearch(formData.portOfLoadingName || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSeaDestinations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/sea-destinations/getAllDestinations');
      const data = await res.json();
      if (data.success) setSeaDestinations(data.data);
    } catch (err) {
      toast.error('Failed to load ports');
    }
  };

  const handlePortSelect = (port) => {
    setFormData(prev => ({
      ...prev,
      portOfLoadingId: port._id,
      portOfLoadingName: port.name
    }));
    setPortSearch(`${port.code} - ${port.name}`);
    setShowPortDropdown(false);
  };

  const filteredPorts = seaDestinations.filter(p =>
    p.code.toLowerCase().includes(portSearch.toLowerCase()) ||
    p.name.toLowerCase().includes(portSearch.toLowerCase())
  );

  const handleNext = () => {
    if (!formData.portOfLoadingId || !formData.mblNumber) {
      toast.error('Port of Loading and MBL Number are required!');
      return;
    }
    onNext();
  };

  return (
    <div className="section">
      <h3>Port of Loading Information</h3>
      <div className="form-grid">

        {/* Port of Loading */}
        <div className="input-group" style={{ position: 'relative' }}>
          <label>Port of Loading <span className="required">*</span></label>
          <input
            type="text"
            value={portSearch}
            onChange={(e) => {
              setPortSearch(e.target.value);
              setShowPortDropdown(true);
            }}
            onFocus={() => setShowPortDropdown(true)}
            placeholder="Type port code or name..."
            disabled={loading}
          />
          {showPortDropdown && (
            <div className="autocomplete-dropdown">
              {filteredPorts.map(port => (
                <div
                  key={port._id}
                  className="autocomplete-item"
                  onClick={() => handlePortSelect(port)}
                >
                  <strong>{port.code}</strong> — {port.name}
                </div>
              ))}
              {showPortDropdown && filteredPorts.length === 0 && (
                <div className="autocomplete-item no-result">No port found</div>
              )}
            </div>
          )}
        </div>

        <div className="input-group">
          <label>Port of Loading Name</label>
          <input
            value={formData.portOfLoadingName || ''}
            readOnly
            disabled
            style={{ backgroundColor: '#ecfdf5', color: '#065f46', fontWeight: '600' }}
          />
        </div>

        {/* MBL Number */}
        <div className="input-group">
          <label>MBL Number <span className="required">*</span></label>
          <input
            name="mblNumber"
            value={formData.mblNumber || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, mblNumber: e.target.value }))}
            placeholder="e.g. SIN123456789"
            disabled={loading}
          />
        </div>

      </div>

      <div className="form-actions" style={{ marginTop: '3rem' }}>
        <button type="button" className="btn-secondary" onClick={onPrevious}>
          ← Previous
        </button>

        <button type="button" className="btn-primary" onClick={handleNext}>
          Save & Finish
        </button>
      </div>
    </div>
  );
};

export default PortOfLoadingInfo;
