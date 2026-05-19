import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';

const API_BASE_URL = "http://localhost:8080/api";

function WelcomePage() {
  const [step, setStep] = useState('role');
  const [guestContact, setGuestContact] = useState("");
  const [activeBooking, setActiveBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('activeGuestBooking');
  }, []);

  const handleManagerClick = () => navigate('/admin');

  const handleGuestClick = () => {
    setStep('guest-login');
  };

  const handleBack = () => {
    setStep('role');
    setGuestContact("");
    setEnteredOtp("");
    setShowOtpField(false);
    setActiveBooking(null);
    localStorage.removeItem('activeGuestBooking');
  };

  const commands = [
    {
      command: ['manager login', 'go to manager', 'open manager'],
      callback: () => handleManagerClick()
    },
    {
      command: ['guest services', 'go to guest', 'open guest'],
      callback: () => handleGuestClick()
    },
    {
      command: ['number *', 'phone *', 'enter *', 'my number is *'],
      callback: (spokenText) => {
        const wordsToNumbers = { 'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9' };
        let parsedText = spokenText.toLowerCase();
        Object.keys(wordsToNumbers).forEach(word => {
          parsedText = parsedText.replaceAll(word, wordsToNumbers[word]);
        });

        const digits = parsedText.replace(/[^0-9]/g, '');
        if (digits.length <= 10) {
          setGuestContact(digits);
        }
      }
    },
    {
      command: ['continue', 'submit', 'verify', 'login'],
      callback: () => {
        const btn = document.getElementById('guest-submit-btn');
        if (btn && !btn.disabled) btn.click();
      }
    },
    {
      command: ['book a room', 'vacate room', 'go to rooms', 'rooms'],
      callback: () => navigate('/rooms')
    },
    {
      command: ['order food', 'dining', 'food', 'dining and room service', '* dining *'],
      callback: () => navigate('/food')
    },
    {
      command: [
        'room cleaning',
        'cleaning',
        'decoration',
        'decorating',
        'housekeeping',
        'room cleaning and decoration',
        '* room cleaning *',
        '* decoration *'
      ],
      callback: () => navigate('/room-service')
    },
    {
      command: ['go back', 'exit'],
      callback: () => handleBack()
    }
  ];

  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  const handleContactChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 10) {
      setGuestContact(numericValue);
    }
  };

  const handleGuestCheck = (e) => {
    if (e) e.preventDefault();

    if (guestContact.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!showOtpField) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(otp);
      setShowOtpField(true);
      alert(`[MOCK SMS] Your Grand Hotel Login OTP is: ${otp}`);
      return;
    }
    if (enteredOtp !== generatedOtp) {
      alert("Invalid OTP! Please enter the 4-digit code shown in the Mock SMS.");
      return;
    }

    setIsLoading(true);

    fetch(`${API_BASE_URL}/guest-check?contact=${guestContact}`)
      .then(res => res.json())
      .then(data => {
        if (data.hasBooking) {
          setActiveBooking(data);
          localStorage.setItem('activeGuestBooking', JSON.stringify(data));
        } else {
          setActiveBooking(null);
          localStorage.setItem('activeGuestBooking', JSON.stringify({ hasBooking: false }));
        }
        setStep('services');
      })
      .catch(err => {
        alert("Connection Error. Please try again.");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="welcome-container">
      <div className="welcome-logo-wrapper">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80"
          alt="Hotel Luxury"
          className="welcome-real-logo"
        />
      </div>

      <h1 className="welcome-title">Grand Hotel & Suites</h1>
      <p className="welcome-subtitle">Experience luxury in the heart of the city.</p>

      {step === 'role' && (
        <div className="role-selection fade-in">
          <p className="selection-label">Select your portal</p>
          <div className="welcome-nav-buttons">
            <button onClick={handleManagerClick} className="welcome-nav-btn btn-manager-role">
              Manager Login
            </button>
            <button onClick={handleGuestClick} className="welcome-nav-btn btn-guest-role">
              Guest Services
            </button>
          </div>
        </div>
      )}

      {step === 'guest-login' && (
        <div className="fade-in">
          <p className="selection-label">Please enter your 10-digit mobile number</p>
          <form onSubmit={handleGuestCheck} style={{ maxWidth: '300px', margin: '0 auto' }}>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Mobile Number"
                value={guestContact}
                onChange={handleContactChange}
                maxLength="10"
                required
                className="guest-input"
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px' }}
              />
              <div style={{ fontSize: '0.8rem', color: '#636e72', marginTop: '5px', textAlign: 'right' }}>
                {guestContact.length}/10
              </div>
            </div>

            {showOtpField && (
              <div className="form-group fade-in">
                <label style={{ color: 'white', textAlign: 'center' }}>Enter 4-Digit OTP</label>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="****"
                  maxLength="4"
                  required
                  className="guest-input"
                  style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '5px' }}
                />
              </div>
            )}

            <button
              id="guest-submit-btn"
              type="submit"
              className="welcome-nav-btn btn-guest-role"
              disabled={isLoading || guestContact.length !== 10}
              style={{
                width: '100%',
                marginTop: '1rem',
                opacity: (guestContact.length === 10) ? 1 : 0.6,
                cursor: (guestContact.length === 10) ? 'pointer' : 'not-allowed'
              }}
            >
              {isLoading ? 'Verifying...' : (showOtpField ? 'Login securely' : 'Send OTP')}
            </button>
          </form>
          <button onClick={handleBack} className="btn-back-link">← Back</button>
        </div>
      )}

      {step === 'services' && (
        <div className="guest-options fade-in">
          <p className="selection-label">
            {activeBooking
              ? `Welcome back, ${activeBooking.customerName}.`
              : "Welcome! How can we serve you today?"}
          </p>

          <div className="welcome-nav-buttons">
            {activeBooking ? (
              <Link to="/rooms" className="welcome-nav-btn btn-vacate-menu">
                Vacate Room {activeBooking.roomNumber}
              </Link>
            ) : (
              <Link to="/rooms" className="welcome-nav-btn btn-rooms">
                Book a Room
              </Link>
            )}

            <Link to="/food" className="welcome-nav-btn btn-food">
              Dining & Food Service
            </Link>

            <Link to="/room-service" className="welcome-nav-btn btn-rooms" style={{ marginTop: '10px', backgroundColor: '#e17055' }}>
              Room Cleaning & Decoration
            </Link>

          </div>
          <button onClick={handleBack} className="btn-back-link">← Exit</button>
        </div>
      )}

      {browserSupportsSpeechRecognition && (
        <div className="voice-controls fade-in" style={{ marginTop: '40px', textAlign: 'center', padding: '15px' }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold', color: '#444' }}>🎙️ Hands-Free Navigation</p>
          <button
            onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({ continuous: true })}
            style={{
              padding: '10px 20px',
              backgroundColor: listening ? '#ff4c4c' : '#2196f3',
              color: 'white',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.3s'
            }}
          >
            {listening ? '🔴 Listening...' : '🎤 Click to Speak'}
          </button>
          <p style={{ marginTop: '10px', color: '#666', fontSize: '13px', fontStyle: 'italic', minHeight: '20px' }}>
            {listening ? `Heard: "${transcript}"` : 'Say "Guest Services", "Number [123...]", then "Continue"'}
          </p>
        </div>
      )}

    </div>
  );
}

export default WelcomePage;