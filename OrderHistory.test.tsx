'''
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
'''
