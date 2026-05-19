import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const API_BASE_URL = "http://localhost:8080/api";
  
function AdminDashboard({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [pastGuests, setPastGuests] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else {
      fetchCustomers();
    }
  }, [isAuthenticated, navigate]);

  const fetchCustomers = () => {
    fetch(`${API_BASE_URL}/customers`)
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error(err));

    fetch(`${API_BASE_URL}/history`)
      .then(res => res.json())
      .then(data => setPastGuests(data))
      .catch(err => console.error(err));
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container">
      <div style={{marginTop: '2rem'}}>
        <h1 className="section-title" style={{marginBottom: 0}}>Manager Dashboard</h1>
      </div>

      <div className="table-wrapper" style={{marginTop: '2rem'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0 }}>Customer Database</h3>
          <button 
            onClick={() => navigate('/admin/room-services')} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#e17055',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ⚙️ Manage Room Services
          </button>
        </div>
        <table className="app-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Room #</th>
              <th>Room Status</th>
              <th>Room Bill</th>
              <th>Food Bill</th>
              <th>Total Bill</th>
              <th>Bill Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.contact}</td>
                
                <td style={{fontWeight: 'bold'}}>
                  {customer.roomNumber}
                </td>

                <td>
                  <span className={customer.roomStatus === 'Occupied' ? 'status-booked' : 'status-available'}>
                    {customer.roomStatus}
                  </span>
                </td>

                <td style={{color: '#555'}}>₹{customer.roomBill.toFixed(2)}</td>

                <td style={{color: '#555'}}>₹{customer.foodBill.toFixed(2)}</td>
                
                <td style={{fontWeight: 'bold', color: '#2c3e50'}}>₹{customer.totalBill.toFixed(2)}</td>

                <td>
                   <span style={{
                     padding: '4px 8px', 
                     borderRadius: '12px',
                     fontSize: '0.85rem',
                     fontWeight: '600',
                     backgroundColor: customer.billStatus === 'Pending' ? '#fff3cd' : '#d4edda',
                     color: customer.billStatus === 'Pending' ? '#856404' : '#155724'
                   }}>
                     {customer.billStatus}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-wrapper" style={{marginTop: '3rem', marginBottom: '2rem'}}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0 }}>Guest History (Past Check-outs)</h3>
        </div>
        {pastGuests.length === 0 ? (
          <p style={{padding: '1rem', textAlign: 'center'}}>No past guests found.</p>
        ) : (
          <table className="app-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Room #</th>
                <th>Room Bill</th>
                <th>Food Bill</th>
                <th>Total Paid</th>
                <th>Check-Out Date</th>
              </tr>
            </thead>
            <tbody>
              {pastGuests.map(guest => (
                <tr key={guest.id}>
                  <td>{guest.id}</td>
                  <td>{guest.customerName}</td>
                  <td>{guest.customerContact}</td>
                  <td style={{fontWeight: 'bold'}}>{guest.roomNumber}</td>
                  <td style={{color: '#555'}}>₹{guest.roomBill?.toFixed(2) || '0.00'}</td>
                  <td style={{color: '#555'}}>₹{guest.foodBill?.toFixed(2) || '0.00'}</td>
                  <td style={{fontWeight: 'bold', color: '#2c3e50'}}>₹{guest.totalBill?.toFixed(2) || '0.00'}</td>
                  <td>{guest.checkOutDate ? new Date(guest.checkOutDate).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;