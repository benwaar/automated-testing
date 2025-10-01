import { test, expect, Page } from '@playwright/test';

test.describe('Keycloak Login', () => {
  test('should successfully login to Keycloak Administration Console', async ({ page }) => {
    // Navigate to the Keycloak login page
    await page.goto('https://localhost:8443/"');

    // Wait for the login page to load
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();

    // Fill in the username field
    await page.locator('input[name="username"]').fill(process.env.KEYCLOAK_USERNAME || 'nope');

    // Fill in the password field
    await page.locator('input[name="password"]').fill(process.env.KEYCLOAK_PASSWORD || 'nope');

    // Click the Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify successful login by checking for the administration console
    await expect(page).toHaveTitle('Keycloak Administration Console');
    
    // Verify that we're on the admin console page
    await expect(page.getByText('You are logged in as a temporary admin user')).toBeVisible();
    
    // Verify navigation elements are present
    await expect(page.getByRole('link', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Clients' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Realm settings' })).toBeVisible();
  });
});