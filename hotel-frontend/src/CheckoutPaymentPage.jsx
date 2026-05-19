import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import './App.css';

const API_BASE_URL = "http://localhost:8080/api";

function CheckoutPaymentPage() {
  const { roomNumber } = useParams();
  const location = useLocation();
  const [bill, setBill] = useState(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (location.state && location.state.bill) {
      setBill(location.state.bill);
      setName(location.state.name);
      setContact(location.state.contact);
    } else {
      setErrorMsg("No bill data found. Access denied.");
    }
  }, [location]);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      fetch(`${API_BASE_URL}/rooms/${roomNumber}/vacate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: name, customerContact: contact })
      })
        .then(async (res) => {
          if (res.ok) {
            setIsPaid(true);
            localStorage.removeItem('activeGuestBooking');
          } else {
            setErrorMsg(await res.text());
          }
        })
        .catch(err => setErrorMsg("Network Error: " + err.message))
        .finally(() => setIsProcessing(false));
    }, 2500);
  };

  if (errorMsg) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Error</h2>
        <p style={{ color: 'red' }}>{errorMsg}</p>
        <Link to="/rooms" className="btn btn-cancel" style={{ display: 'inline-block', marginTop: '1rem', padding: '10px 20px', textDecoration: 'none' }}>Back to Rooms</Link>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Loading Payment Gateway...</h2>
      </div>
    );
  }

  const formatItemName = (itemName) => {
    return itemName.replace(/\(x\d+\)/g, '').trim();
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=grandhotel@upi&pn=GrandHotel&am=${parseInt(bill.grandTotal)}`;

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div className="bill-container fade-in" style={{ flex: '1 1 400px', margin: 0 }}>
        <div className="bill-header">
          <h1>Final Checkout Bill</h1>
          <p>Room {roomNumber} • {name.toUpperCase()}</p>
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

          {bill.foodItems && bill.foodItems.length > 0 && (
            <div className="bill-section" style={{ marginTop: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#636e72', textTransform: 'uppercase' }}>Dining Details</h4>
              {bill.foodItems.map((item, index) => (
                <div key={index} className="bill-item bill-food-item" style={{ fontSize: '0.9rem', color: '#555' }}>
                  <span>{formatItemName(item.itemName)}</span>
                  <span>₹{item.itemPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '2px dashed #dfe6e9' }} />

          <div className="bill-grand-total" style={{ fontSize: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <strong>To Pay</strong>
            <strong style={{ color: '#d35400' }}>₹{bill.grandTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className="bill-container fade-in" style={{ flex: '1 1 350px', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Scan to Pay</h2>

        {!isPaid ? (
          <>
            <p style={{ color: '#636e72', textAlign: 'center', marginBottom: '1.5rem' }}>
              Scan the QR code with any UPI app like GPay, PhonePe, or Paytm to complete your checkout.
            </p>

            <div style={{ padding: '15px', background: 'white', borderRadius: '12px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <img src={qrUrl} alt="UPI Payment QR Scanner" style={{ width: '180px', height: '180px', display: 'block' }} />
            </div>

            <div style={{ marginTop: '2rem', width: '100%' }}>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '1.2rem',
                  backgroundColor: isProcessing ? '#b2bec3' : '#0984e3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'background 0.3s'
                }}
              >
                {isProcessing ? 'Processing Payment...' : 'I have completed the payment'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#27ae60', marginBottom: '1rem' }}>Payment Successful!</h2>
            <p style={{ color: '#2d3436', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              Your transaction of <strong>₹{bill.grandTotal.toFixed(2)}</strong> was received.<br />
              The room is now vacated and recorded in standard history.
            </p>
            <Link to="/rooms">
              <button className="btn btn-submit" style={{ padding: '12px 25px', fontSize: '1.1rem' }}>Back to Home</button>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}

export default CheckoutPaymentPage;
