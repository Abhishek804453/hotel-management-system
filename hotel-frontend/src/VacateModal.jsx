import React, { useState } from 'react';
import './App.css';

function VacateModal({ room, onClose, onVerify }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !contact) {
      setError("Please fill in both fields.");
      return;
    }

    if (!showOtpField) {

      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(otp);
      setShowOtpField(true);
      setError(null);

      alert(`[MOCK SMS] Your Grand Hotel Vacate Verification OTP is: ${otp}`);
      return;
    }
    if (enteredOtp !== generatedOtp) {
      setError("Incorrect OTP entered. Please try again.");
      return;
    }

    onVerify(room.roomNumber, name, contact);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Verify Checkout</h3>
        <p style={{ textAlign: 'center', color: '#636e72', marginBottom: '1.5rem' }}>
          To vacate <strong>Room {room.roomNumber}</strong>, please verify customer identity.
        </p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name used for booking"
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter registered mobile number"
              required
            />
          </div>

          {showOtpField && (
            <div className="form-group slide-down fade-in">
              <label>Enter 4-Digit OTP</label>
              <input
                type="text"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="****"
                maxLength="4"
                required
                style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
              />
            </div>
          )}

          {error && <p className="error-text" style={{ color: '#ff7675', textAlign: 'center' }}>{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn btn-vacate">
              {showOtpField ? "Verify OTP" : "Send OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VacateModal;