import React from 'react';

function FoodPage({
  menu,
  foodOrders,
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onPlaceOrder
}) {
  return (
    <div className="food-column">
      <h2 className="section-title">Food Menu</h2>
      <MenuTable
        menu={menu}
        onAddToCart={onAddToCart}
      />

      <Cart
        cartItems={cartItems}
        onUpdateQuantity={onUpdateCartQuantity}
        onPlaceOrder={onPlaceOrder}
      />

      <h2 className="section-title" style={{ marginTop: '2rem' }}>Order History</h2>
      <OrderList orders={foodOrders} />
    </div>
  );
}

function MenuTable({ menu, onAddToCart }) {
  return (
    <div className="table-wrapper">
      <table className="app-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
          {menu.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>₹{item.price.toFixed(2)}</td>
              <td>
                <button
                  onClick={() => onAddToCart(item)}
                  className="action-button btn-order"
                >
                  Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cart({ cartItems, onUpdateQuantity, onPlaceOrder }) {
  const totalPrice = cartItems.reduce((total, cartItem) => {
    return total + (cartItem.item.price * cartItem.quantity);
  }, 0);

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="cart-wrapper">
      <h2 className="section-title" style={{ marginTop: '2rem' }}>Your Order</h2>
      {cartItems.map(cartItem => (
        <CartItem
          key={cartItem.item.id}
          cartItem={cartItem}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
      <div className="cart-summary">
        <strong>Total: ₹{totalPrice.toFixed(2)}</strong>
        <button
          className="btn btn-submit"
          onClick={onPlaceOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

function CartItem({ cartItem, onUpdateQuantity }) {
  const { item, quantity } = cartItem;

  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <span className="cart-item-name">{item.name}</span>
        <span className="cart-item-price">₹ {(item.price * quantity).toFixed(2)}</span>
      </div>
      <div className="cart-item-actions">
        <button onClick={() => onUpdateQuantity(item, quantity - 1)}>−</button>
        <span>{quantity}</span>
        <button onClick={() => onUpdateQuantity(item, quantity + 1)}>+</button>
      </div>
    </div>
  );
}

function OrderList({ orders }) {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="order-list-wrapper">
      {orders.length === 0 ? (
        <p className="no-orders-text">No food orders have been placed yet.</p>
      ) : (
        <ul className="order-list">
          {orders.map(order => (
            <li key={order.id} className="order-item">
              <span className="order-item-room">Room {order.roomNumber}</span>
              <span className="order-item-details">
                {order.itemName} - ₹{order.itemPrice.toFixed(2)}
              </span>
              <span className="order-item-time">{formatTime(order.orderTime)}</span>
            </li>
          )).reverse()}
        </ul>
      )}
    </div>
  );
}

export default FoodPage;