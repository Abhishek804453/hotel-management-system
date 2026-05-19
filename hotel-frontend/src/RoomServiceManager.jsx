import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const API_BASE_URL = "http://localhost:8080/api";

function RoomServiceManager() {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = () => {
        fetch(`${API_BASE_URL}/room-service/all`)
            .then(res => res.json())
            .then(data => setRequests(data))
            .catch(err => console.error(err));
    };

    const handleToggle = (id, currentStatus) => {
        const newStatus = currentStatus === 'Pending' ? 'Approved' : 'Pending';

        fetch(`${API_BASE_URL}/room-service/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(() => fetchRequests())
            .catch(err => console.error(err));
    };

    return (
        <div className="welcome-container fade-in" style={{ maxWidth: '800px' }}>
            <h1 className="welcome-title">Manage Room Services</h1>
            <table style={{ width: '100%', margin: '0 auto', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#2d3436', color: 'white' }}>
                        <th style={{ padding: '15px' }}>Room Number</th>
                        <th style={{ padding: '15px' }}>Service Request</th>
                        <th style={{ padding: '15px' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                            <td style={{ padding: '15px', fontWeight: 'bold' }}>{req.roomNumber}</td>
                            <td style={{ padding: '15px' }}>{req.serviceType}</td>
                            <td style={{ padding: '15px' }}>
                                <button
                                    onClick={() => handleToggle(req.id, req.status)}
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '25px',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        backgroundColor: req.status === 'Pending' ? '#ff4c4c' : '#4cd137',
                                        minWidth: '120px'
                                    }}
                                >
                                    {req.status}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => navigate('/admin')} className="btn-back-link" style={{ marginTop: '2rem' }}>← Back to Dashboard</button>
        </div>
    );
}

export default RoomServiceManager;