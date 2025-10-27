'''
# Unit Test Examples for E-commerce Personal Dashboard

This document provides comprehensive examples of unit tests for a personal dashboard in an e-commerce application. The examples use Playwright for component testing and focus on a Shopify-like dashboard.

## Table of Contents

- [Introduction to Component Testing](#introduction-to-component-testing)
- [Test Scenarios](#test-scenarios)
- [Component Examples](#component-examples)
  - [UserProfile Component](#userprofile-component)
  - [OrderHistory Component](#orderhistory-component)
- [Unit Test Examples](#unit-test-examples)
  - [UserProfile Component Tests](#userprofile-component-tests)
  - [OrderHistory Component Tests](#orderhistory-component-tests)
- [Best Practices](#best-practices)
- [Conclusion](#conclusion)

## Introduction to Component Testing

Component testing focuses on testing individual UI components in isolation. This approach allows for faster and more reliable tests, as it doesn't require running the entire application. Playwright's experimental component testing feature enables developers to mount and test components in a real browser environment.

## Test Scenarios

For a personal dashboard, we can identify several key scenarios to test:

- **User Profile:**
  - Display loading state while fetching user data.
  - Display user information correctly after successful data fetching.
  - Display an error message if data fetching fails.
- **Order History:**
  - Display a loading state while fetching the order history.
  - Display the list of orders correctly.
  - Display a message when there are no orders.
  - Display an error message if fetching fails.

## Component Examples

Here are the React components for the `UserProfile` and `OrderHistory` sections of the dashboard.

### UserProfile Component

This component fetches and displays the user's name and email.

```typescript
// src/components/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { getUser } from '../api';

interface User {
  name: string;
  email: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (err) {
        setError('Failed to fetch user data');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div data-testid="loading">Loading...</div>;
  }

  if (error) {
    return <div data-testid="error">{error}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div data-testid="user-profile">
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default UserProfile;
```

### OrderHistory Component

This component fetches and displays a list of the user's past orders.

```typescript
// src/components/OrderHistory.tsx
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
```

## Unit Test Examples

Here are the unit tests for the `UserProfile` and `OrderHistory` components using Playwright.

### UserProfile Component Tests

```typescript
// src/components/UserProfile.test.tsx
import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import UserProfile from './UserProfile';

test.use({ viewport: { width: 500, height: 500 } });

test('should display loading state initially', async ({ mount, page }) => {
  await page.route('**/api/getUser', route => {
    // Do not resolve the request to keep the component in loading state
  });

  const component = await mount(<UserProfile />);
  await expect(component.getByTestId('loading')).toBeVisible();
});

test('should display user profile after fetching data', async ({ mount, page }) => {
  const mockUser = { name: 'John Doe', email: 'john.doe@example.com' };
  await page.route('**/api/getUser', route => {
    route.fulfill({ json: mockUser });
  });

  const component = await mount(<UserProfile />);
  await expect(component.getByTestId('user-profile')).toBeVisible();
  await expect(component).toContainText('John Doe');
  await expect(component).toContainText('john.doe@example.com');
});

test('should display error message on fetch failure', async ({ mount, page }) => {
  await page.route('**/api/getUser', route => {
    route.abort();
  });

  const component = await mount(<UserProfile />);
  await expect(component.getByTestId('error')).toBeVisible();
  await expect(component).toContainText('Failed to fetch user data');
});
```

### OrderHistory Component Tests

```typescript
// src/components/OrderHistory.test.tsx
import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import OrderHistory from './OrderHistory';

test.use({ viewport: { width: 800, height: 600 } });

test('should display loading state initially', async ({ mount, page }) => {
  await page.route('**/api/getOrders', route => {
    // Do not resolve the request to keep the component in loading state
  });

  const component = await mount(<OrderHistory />);
  await expect(component.getByTestId('loading')).toBeVisible();
});

test('should display order history after fetching data', async ({ mount, page }) => {
  const mockOrders = [
    { id: '1', date: '2023-10-27', total: 100, status: 'Shipped' },
    { id: '2', date: '2023-10-26', total: 50, status: 'Delivered' },
  ];
  await page.route('**/api/getOrders', route => {
    route.fulfill({ json: mockOrders });
  });

  const component = await mount(<OrderHistory />);
  await expect(component.getByTestId('order-history')).toBeVisible();
  await expect(component.getByRole('row')).toHaveCount(3); // Including header row
  await expect(component).toContainText('Shipped');
  await expect(component).toContainText('Delivered');
});

test('should display no orders message for empty order history', async ({ mount, page }) => {
  await page.route('**/api/getOrders', route => {
    route.fulfill({ json: [] });
  });

  const component = await mount(<OrderHistory />);
  await expect(component.getByTestId('no-orders')).toBeVisible();
  await expect(component).toContainText('No orders found.');
});

test('should display error message on fetch failure', async ({ mount, page }) => {
  await page.route('**/api/getOrders', route => {
    route.abort();
  });

  const component = await mount(<OrderHistory />);
  await expect(component.getByTestId('error')).toBeVisible();
  await expect(component).toContainText('Failed to fetch order history');
});
```

## Best Practices

- **Mock API Requests:** Use `page.route()` to intercept and mock API requests. This isolates the component from the backend and ensures consistent test results.
- **Test States:** Test all possible states of the component: loading, success (with data), empty (no data), and error.
- **Use `data-testid`:** Use `data-testid` attributes to select elements for testing. This makes the tests more resilient to changes in the component's structure or styling.
- **Web-First Assertions:** Use Playwright's web-first assertions like `toBeVisible()` and `toContainText()`. These assertions automatically wait for the condition to be met, making the tests more reliable.
- **Isolate Tests:** Each test should be independent and not rely on the state of other tests.

## Conclusion

These examples demonstrate how to write effective unit tests for a personal dashboard in an e-commerce application using Playwright. By following these patterns and best practices, you can ensure the quality and reliability of your UI components.
'''
