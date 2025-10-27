
import React, { useState, useEffect } from 'react';
import { getOrders } from '../api';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderData = await getOrders();
        setOrders(orderData);
      } catch (err) {
        setError('Failed to fetch order history');
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div data-testid="loading">Loading...</div>;
  }

  if (error) {
    return <div data-testid="error">{error}</div>;
  }

  if (orders.length === 0) {
    return <div data-testid="no-orders">No orders found.</div>;
  }

  return (
    <div data-testid="order-history">
      <h2>Order History</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;

