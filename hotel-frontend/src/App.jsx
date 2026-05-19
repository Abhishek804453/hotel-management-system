import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';

import './App.css';


import RoomPage from './RoomPage.jsx';
import FoodPage from './FoodPage.jsx';
import VacatePage from './VacatePage_TEMP.jsx';
import CheckoutPaymentPage from './CheckoutPaymentPage.jsx';
import WelcomePage from './WelcomePage.jsx';
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from './AdminDashboard_TEMP.jsx';
import Chatbot from './Chatbot';
import RoomServicePage from './RoomServicePage';
import RoomServiceManager from './RoomServiceManager';

const API_BASE_URL = "http://localhost:8080/api";

function Navigation({ isAuthenticated, onLogout }) {
  const location = useLocation();

  const hideNavLinks = location.pathname === '/' || location.pathname === '/admin';

  return (
    <nav className="main-nav">
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Home
      </NavLink>


      {!hideNavLinks && (
        <>
          <NavLink
            to="/rooms"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Room Status
          </NavLink>
          <NavLink
            to="/food"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Food Service
          </NavLink>
        </>
      )}

      {isAuthenticated && (
        <>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Manager Dashboard
          </NavLink>
          <button
            onClick={onLogout}
            className="nav-btn-logout"
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}


function App() {
  const [rooms, setRooms] = useState([]);
  const [menu, setMenu] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isManager') === 'true'
  );

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(silentFetchAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const shouldRefresh = localStorage.getItem('refreshData');
    if (shouldRefresh === 'true') {
      localStorage.removeItem('refreshData');
      fetchAllData();
    }
  }, [location]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isManager', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isManager');
    navigate('/');
  };

  const fetchAllData = () => {
    setIsLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/rooms`),
      fetch(`${API_BASE_URL}/menu`),
      fetch(`${API_BASE_URL}/orders`)
    ])
      .then(([roomsRes, menuRes, ordersRes]) => {
        if (!roomsRes.ok) throw new Error('Failed to fetch rooms');
        if (!menuRes.ok) throw new Error('Failed to fetch menu');
        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        return Promise.all([roomsRes.json(), menuRes.json(), ordersRes.json()]);
      })
      .then(([roomsData, menuData, ordersData]) => {
        setRooms(roomsData);
        setMenu(menuData);
        setFoodOrders(ordersData);
        setError(null);
      })
      .catch(err => {
        setError("Failed to load data. Is the backend running? " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const silentFetchAllData = () => {
    Promise.all([
      fetch(`${API_BASE_URL}/rooms`),
      fetch(`${API_BASE_URL}/menu`),
      fetch(`${API_BASE_URL}/orders`)
    ])
      .then(([roomsRes, menuRes, ordersRes]) => {
        if (!roomsRes.ok || !menuRes.ok || !ordersRes.ok) return Promise.reject("Fetch failed");
        return Promise.all([roomsRes.json(), menuRes.json(), ordersRes.json()]);
      })
      .then(([roomsData, menuData, ordersData]) => {
        setRooms(roomsData);
        setMenu(menuData);
        setFoodOrders(ordersData);
      })
      .catch(() => {
      });
  };

  const fetchRooms = () => {
    fetch(`${API_BASE_URL}/rooms`)
      .then(response => response.json())
      .then(data => setRooms(data))
      .catch(err => setError("Failed to refresh rooms."));
  };

  const fetchOrders = () => {
    fetch(`${API_BASE_URL}/orders`)
      .then(response => response.json())
      .then(data => setFoodOrders(data))
      .catch(err => setError("Failed to refresh orders."));
  };

  const openBookingModal = (room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedRoom(null);
    setCustomerName("");
    setCustomerContact("");
  };

  const handleBookRoom = (e) => {
    e.preventDefault();
    const bookingData = { customerName, customerContact };
    fetch(`${API_BASE_URL}/rooms/${selectedRoom.roomNumber}/book`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    })
      .then(response => {
        if (!response.ok) throw new Error('Booking failed. Room might be taken.');
        return response.json();
      })
      .then(() => {
        closeBookingModal();
        fetchRooms();
      })
      .catch(err => alert("Error: " + err.message));
  };

  const handleAddToCart = (itemToAdd) => {
    setCartItems(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === itemToAdd.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === itemToAdd.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { item: itemToAdd, quantity: 1 }];
      }
    });
  };

  const handleUpdateCartQuantity = (itemToUpdate, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemToUpdate.id));
    } else {
      setCartItems(prevCart =>
        prevCart.map(cartItem =>
          cartItem.item.id === itemToUpdate.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCheckoutModal = () => {
    const combinedName = cartItems
      .map(cartItem => `${cartItem.item.name} (x${cartItem.quantity})`)
      .join(', ');

    const totalPrice = cartItems.reduce((total, cartItem) => {
      return total + (cartItem.item.price * cartItem.quantity);
    }, 0);

    const summaryItem = { name: combinedName, price: totalPrice };

    setSelectedFoodItem(summaryItem);
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedFoodItem(null);
  };

  const handlePlaceOrder = (roomNumber, item) => {
    if (!roomNumber) {
      alert("Please select a room.");
      return;
    }
    const orderRequest = {
      roomNumber: parseInt(roomNumber),
      itemName: item.name,
      itemPrice: item.price
    };
    fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderRequest)
    })
      .then(response => {
        if (!response.ok) throw new Error('Order failed. Is the room currently booked?');
        return response.json();
      })
      .then(() => {
        closeOrderModal();
        fetchOrders();
        clearCart();
      })
      .catch(err => alert("Error: " + err.message));
  };

  const bookedRooms = rooms.filter(room => room.booked);

  return (
    <div className="container">
      <h1 className="header">
        AI Smart Hotel Automation
      </h1>

      <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      {isLoading && <p className="loading-text">Loading data...</p>}

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!isLoading && !error && (
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/rooms" element={<RoomPage rooms={rooms} onBook={openBookingModal} isAuthenticated={isAuthenticated} />} />
          <Route path="/food" element={<FoodPage menu={menu} foodOrders={foodOrders} cartItems={cartItems} onAddToCart={handleAddToCart} onUpdateCartQuantity={handleUpdateCartQuantity} onPlaceOrder={openCheckoutModal} />} />
          <Route path="/room/:roomNumber/vacate" element={<VacatePage />} />
          <Route path="/room/:roomNumber/payment" element={<CheckoutPaymentPage />} />
          <Route path="/admin" element={<AdminLogin onLogin={handleLogin} />} />
          <Route path="/admin/dashboard" element={<AdminDashboard isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
          <Route path="/room-service" element={<RoomServicePage />} />
          <Route path="/admin/room-services" element={<RoomServiceManager />} />
        </Routes>
      )}

      {isBookingModalOpen && (
        <BookingModal room={selectedRoom} onClose={closeBookingModal} onSubmit={handleBookRoom} customerName={customerName} setCustomerName={setCustomerName} customerContact={customerContact} setCustomerContact={setCustomerContact} />
      )}

      {isOrderModalOpen && (
        <FoodOrderModal item={selectedFoodItem} bookedRooms={bookedRooms} onClose={closeOrderModal} onSubmit={handlePlaceOrder} />
      )}

      <Chatbot />

    </div>
  );
}
function BookingModal({
  room,
  onClose,
  onSubmit,
  customerName,
  setCustomerName,
  customerContact,
  setCustomerContact
}) {

  const [contactError, setContactError] = useState(null);

  const handleContactChange = (e) => {

    const value = e.target.value;

    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue.length <= 10) {

      setCustomerContact(numericValue);

      if (contactError) {
        setContactError(null);
      }
    }
  };

  const handleSubmitWithValidation = (e) => {

    e.preventDefault();

    if (customerContact.length !== 10) {

      setContactError(
        "Contact number must be exactly 10 digits."
      );

      return;
    }

    setContactError(null);

    onSubmit(e);
  };

  const contactInputClass =
    contactError ? 'input-error' : '';

  return (

    <div className="modal-overlay">

      <div className="modal-content">

        <h3>
          Book Room {room.roomNumber}
        </h3>

        <div className="modal-room-details">

          <span className="room-type-modal">
            {room.roomType}
          </span>

          <span className="room-price-modal">
            ${room.price.toFixed(2)} / night
          </span>

        </div>

        <form
          className="modal-form"
          onSubmit={handleSubmitWithValidation}
        >

          <div className="form-group">

            <label htmlFor="customerName">
              Customer Name
            </label>

            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="customerContact">
              Contact Info (10 Digits)
            </label>

            <input
              type="tel"
              id="customerContact"
              value={customerContact}
              onChange={handleContactChange}
              required
              pattern="[0-9]*"
              maxLength="10"
              placeholder="e.g., 5551234567"
              className={contactInputClass}
            />

            {contactError && (
              <p className="form-error">
                {contactError}
              </p>
            )}

          </div>

          <div className="modal-actions">

            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-submit"
            >
              Confirm Booking
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

function FoodOrderModal({
  item,
  bookedRooms,
  onClose,
  onSubmit
}) {

  const [selectedRoomNumber, setSelectedRoomNumber] =
    useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    onSubmit(selectedRoomNumber, item);
  };

  return (

    <div className="modal-overlay">

      <div className="modal-content">

        <h3>Order Food</h3>

        <div className="modal-room-details">

          <span className="room-type-modal">
            Items: {item.name}
          </span>

          <span className="room-price-modal">
            Total Price: ${item.price.toFixed(2)}
          </span>

        </div>

        <form
          className="modal-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="roomSelect">
              Select a Booked Room
            </label>

            {bookedRooms.length > 0 ? (

              <select
                id="roomSelect"
                value={selectedRoomNumber}
                onChange={(e) =>
                  setSelectedRoomNumber(e.target.value)
                }
                required
              >

                <option value="" disabled>
                  Select a room...
                </option>

                {bookedRooms.map((room) => (

                  <option
                    key={room.id}
                    value={room.roomNumber}
                  >
                    Room {room.roomNumber}
                    ({room.customerName})
                  </option>

                ))}

              </select>

            ) : (

              <p className="form-error">
                No rooms are currently booked.
              </p>

            )}

          </div>

          <div className="modal-actions">

            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-submit"
              disabled={bookedRooms.length === 0}
            >
              Place Order
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default App;
