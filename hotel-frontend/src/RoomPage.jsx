import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VacateModal from './VacateModal';
import './App.css';

const API_BASE_URL = "http://localhost:8080/api";

function RoomPage({ rooms, onBook, isAuthenticated }) {
  const navigate = useNavigate();
  const [selectedRoomForVacate, setSelectedRoomForVacate] = useState(null);

  let displayedRooms = [...rooms].sort((a, b) => a.roomNumber - b.roomNumber);

  const storedGuestData = localStorage.getItem('activeGuestBooking');
  let guestInfo = null;
  if (storedGuestData) {
    guestInfo = JSON.parse(storedGuestData);
  }

  if (!isAuthenticated) {

    if (guestInfo && guestInfo.hasBooking) {
      displayedRooms = displayedRooms.filter(room => room.roomNumber === guestInfo.roomNumber);
    } else {
      displayedRooms = displayedRooms.filter(room => !room.booked);
    }
  }


  const handleVacateClick = (room) => {
    setSelectedRoomForVacate(room);
  };

  const handleVerifyAndVacate = (roomNumber, name, contact) => {
    fetch(`${API_BASE_URL}/rooms/${roomNumber}/verify-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: name, customerContact: contact })
    })
      .then(async (res) => {
        if (res.ok) {
          const billData = await res.json();
          navigate(`/room/${roomNumber}/payment`, { state: { bill: billData, name, contact } });
        } else {
          const errorMsg = await res.text();
          alert(errorMsg);
        }
      })
      .catch(err => alert("Network Error: " + err.message));
  };

  const getPageTitle = () => {
    if (isAuthenticated) return "All Rooms Status (Manager View)";
    if (guestInfo && guestInfo.hasBooking) return "Your Room Status";
    return "Vacant Rooms";
  };

  return (
    <div className="container">
      <div className="table-wrapper">
        <h3 style={{ padding: '1rem', borderBottom: '1px solid #eee', margin: 0 }}>
          {getPageTitle()}
        </h3>

        {displayedRooms.length > 0 ? (
          <table className="app-table">
            <thead>
              <tr>
                <th>Room #</th>
                <th>Type</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedRooms.map(room => (
                <RoomRow
                  key={room.id}
                  room={room}
                  onBook={onBook}
                  isAuthenticated={isAuthenticated}
                  onVacateClick={() => handleVacateClick(room)}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#636e72' }}>
            <p>
              {isAuthenticated || (guestInfo && guestInfo.hasBooking)
                ? "No rooms found."
                : "Sorry, no rooms are currently vacant."}
            </p>
          </div>
        )}
      </div>

      {selectedRoomForVacate && (
        <VacateModal
          room={selectedRoomForVacate}
          onClose={() => setSelectedRoomForVacate(null)}
          onVerify={handleVerifyAndVacate}
        />
      )}
    </div>
  );
}

function RoomRow({ room, onBook, isAuthenticated, onVacateClick }) {
  const isBooked = room.booked;

  return (
    <tr>
      <td style={{ fontWeight: '600' }}>{room.roomNumber}</td>
      <td>{room.roomType}</td>
      <td>
        <span className={isBooked ? 'status-booked' : 'status-available'}>
          {isBooked ? 'Booked' : 'Vacant'}
        </span>
      </td>

      <td style={{ color: '#636e72', fontStyle: isBooked ? 'normal' : 'italic' }}>
        {isBooked
          ? (isAuthenticated ? room.customerName : 'Occupied')
          : '---'}
      </td>

      <td>₹{room.price.toFixed(2)}</td>
      <td>
        {isBooked ? (
          <button
            className="action-button btn-vacate"
            onClick={onVacateClick}
          >
            Vacate
          </button>
        ) : (
          <button
            className="action-button btn-book"
            onClick={() => onBook(room)}
          >
            Book Now
          </button>
        )}
      </td>
    </tr>
  );
}

export default RoomPage;