
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

