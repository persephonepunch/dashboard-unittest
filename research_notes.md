# Research Notes: Playwright Unit Testing for E-commerce Dashboard

## Key Findings

### Playwright Component Testing
- Playwright supports component testing (experimental feature)
- Tests run in Node.js while components run in real browser
- Supports React, Vue, and Svelte frameworks
- Uses `mount()` fixture to render components
- Supports props, callbacks, events, children/slots
- Can use hooks (beforeMount, afterMount) for configuration

### Typical Component Test Structure
```typescript
test('event should work', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button title="Submit" onClick={() => { clicked = true }}></Button>
  );
  await expect(component).toContainText('Submit');
  await component.click();
  expect(clicked).toBeTruthy();
});
```

### Shopify Customer Dashboard Features
Based on research, typical Shopify customer dashboard includes:
1. Order history and status tracking
2. Order details (items, prices, dates)
3. Account profile information
4. Saved addresses
5. Payment information
6. Order tracking
7. Returns and refunds

### Best Practices for Unit Testing
- Test user-visible behavior
- Make tests isolated
- Use locators (getByRole, getByText, getByTestId)
- Use web-first assertions (toBeVisible, toContainText)
- Avoid testing third-party dependencies
- Use beforeEach hooks for setup
- Mock external API calls

## Test Scenarios for Personal Dashboard
1. Display user information correctly
2. Show order history list
3. Filter/sort orders
4. Display order details
5. Show order status
6. Handle empty states
7. Handle loading states
8. Handle error states
9. Navigate between sections
10. Update profile information

