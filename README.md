Shopify and Playwright Unit Tests built with AI prompts

feat: Add Playwright unit tests for e-commerce dashboard components

Add comprehensive unit test examples for personal dashboard components
in a Shopify-style e-commerce application using Playwright's experimental
component testing feature.

Components tested:
- UserProfile: Display user account information (name, email)
- OrderHistory: Display customer order history with status tracking

Test coverage includes:
- Loading states during data fetching
- Success states with proper data rendering
- Empty states when no data exists
- Error states with appropriate error messages

Technical implementation:
- Use Playwright's mount() fixture for component rendering
- Mock API requests using page.route() for test isolation
- Implement web-first assertions (toBeVisible, toContainText)
- Use data-testid attributes for resilient element selection
- Configure viewport sizes per component requirements

Files added:
- src/components/UserProfile.tsx
- src/components/UserProfile.test.tsx
- src/components/OrderHistory.tsx
- src/components/OrderHistory.test.tsx
- README.md (comprehensive testing guide with best practices)
