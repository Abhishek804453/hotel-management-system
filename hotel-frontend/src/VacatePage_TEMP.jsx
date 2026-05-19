import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import './App.css';

function VacatePage() {
  const { roomNumber } = useParams();
  const location = useLocation();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    if (location.state && location.state.bill) {
      setBill(location.state.bill);
    } else {
      console.error("No bill data found. Access denied.");
    }
  }, [location]);

  if (!bill) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Loading Bill...</h2>
        <p>If this takes too long, please go back and verify your details again.</p>
        <Link to="/rooms" className="btn btn-cancel">Back to Rooms</Link>
      </div>
    );
  }

  const formatItemName = (name) => {
    return name.replace(/\(x\d+\)/g, '').trim();
  };

  return (
    <div className="container">
      <div className="bill-container fade-in">
        <div className="bill-header">
          <h1>Final Bill Invoice</h1>
          <p>Room {roomNumber}</p>
        </div>

        <div className="bill-details">

          <div className="bill-item">
            <span>Room Charge</span>
            <span>₹{bill.roomPrice.toFixed(2)}</span>
          </div>


          <div className="bill-item">
            <span>Food Bill</span>
            <span>₹{bill.foodTotal.toFixed(2)}</span>
          </div>

          {bill.foodOrders && bill.foodOrders.length > 0 && (
            <div className="bill-section" style={{ marginTop: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#636e72', textTransform: 'uppercase' }}>
                Dining Details
              </h4>
              {bill.foodOrders.map((item, index) => (
                <div key={index} className="bill-item bill-food-item" style={{ fontSize: '0.9rem', color: '#555' }}>
                  <span>{formatItemName(item.itemName)}</span>
                  <span>₹{item.itemPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '2px dashed #dfe6e9' }} />

          <div className="bill-grand-total">
            <strong>Grand Total</strong>
            <strong>₹{bill.grandTotal.toFixed(2)}</strong>
          </div>
        </div>

        <div className="bill-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#27ae60', fontWeight: 'bold', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.2rem' }}>✅</span> Payment Successful
          </div>
          <p style={{ color: '#636e72' }}>The room has been vacated and is now available.</p>

          <Link to="/rooms">
            <button className="btn btn-submit" style={{ marginTop: '1.5rem', width: '100%' }}>
              Return to Room Status
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VacatePage;