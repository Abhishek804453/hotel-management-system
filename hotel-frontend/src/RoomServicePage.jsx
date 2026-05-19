import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const API_BASE_URL = "http://localhost:8080/api";

function RoomServicePage() {
    const [roomNumber, setRoomNumber] = useState('');
    const [serviceType, setServiceType] = useState('Cleaning');
    const navigate = useNavigate();

    useEffect(() => {
        const bookingData = localStorage.getItem('activeGuestBooking');
        if (bookingData) {
            const parsedData = JSON.parse(bookingData);
            if (parsedData.roomNumber) {
                setRoomNumber(parsedData.roomNumber);
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!roomNumber) {
            alert("No active room booking found.");
            return;
        }
        fetch(`${API_BASE_URL}/room-service/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomNumber, serviceType })
        })
        .then(res => res.json())
        .then(() => alert("Request sent successfully!"))
        .catch(() => alert("Connection Error. Please try again."));
    };

    return (
        <div className="welcome-container fade-in">
            <h1 className="welcome-title">Room Service & Decoration</h1>
            <form onSubmit={handleSubmit} style={{maxWidth: '300px', margin: '0 auto'}}>
                <div className="form-group">
                    <input 
                        type="text" 
                        value={roomNumber}
                        readOnly
                        className="guest-input"
                        style={{textAlign: 'center', fontSize: '1.2rem', marginBottom: '1rem', backgroundColor: '#e9ecef'}}
                    />
                </div>
                <div className="form-group">
                    <select 
                        value={serviceType} 
                        onChange={e => setServiceType(e.target.value)}
                        className="guest-input"
                        style={{textAlign: 'center', fontSize: '1.2rem', marginBottom: '1rem', width: '100%'}}
                    >
                        <option value="Cleaning">Room Cleaning</option>
                        <option value="Decoration">Room Decoration</option>
                    </select>
                </div>
                <button type="submit" className="welcome-nav-btn btn-guest-role" style={{width: '100%'}}>
                    SUBMIT REQUEST
                </button>
            </form>
            <button onClick={() => navigate('/')} className="btn-back-link" style={{marginTop: '2rem'}}>← Back to Home</button>
        </div>
    );
}

export default RoomServicePage;