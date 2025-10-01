import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Load configuration based on environment
function loadConfig() {
  const env = process.env.NODE_ENV || 'local';
  const configPath = path.join(__dirname, '..', 'config', `${env}.json`);

  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  // Fallback to example config
  const localConfigPath = path.join(__dirname, '..', 'config', 'example.json');
  return JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
}

interface Config {
  baseUrl: string;
  username: string;
  password: string;
}

test.describe('Keycloak E2E Login Tests', () => {
  let config: Config;

  test.beforeEach(async () => {
    config = loadConfig();
  });

  test('should successfully login to Keycloak Administration Console', async ({ page, context }) => {
    // Ignore SSL certificate errors for localhost
    await context.setExtraHTTPHeaders({});

    const redirectUri = encodeURIComponent(config.baseUrl + 'admin/master/console/');
    const state = Date.now();
    const nonce = Date.now();
    const loginUrl =
      `${config.baseUrl}realms/master/protocol/openid-connect/auth?` +
      `client_id=security-admin-console&redirect_uri=${redirectUri}&state=${state}&` +
      `response_mode=query&response_type=code&scope=openid&nonce=${nonce}`;

    console.log(`🔗 Navigating to: ${loginUrl}`);

    // Navigate to the Keycloak login page
    await page.goto(loginUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for the login page to load
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible({ timeout: 15000 });

    // Fill in the username field
    await page.locator('input[name="username"]').fill(config.username);
    console.log(`📧 Entered username: ${config.username}`);

    // Fill in the password field
    await page.locator('input[name="password"]').fill(config.password);
    console.log('🔐 Password entered');

    // Click the Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();
    console.log('🔑 Login button clicked');

    // Wait for redirect to admin console
    await page.waitForURL(url => url.toString().includes('/admin/master/console'), {
      timeout: 20000
    });

    // Verify successful login by checking for the administration console
    await expect(page).toHaveTitle(/Keycloak/i, { timeout: 15000 });

    // Verify that we're in the admin console
    const adminElements = [
      page.getByText('Master realm').first(),
      page.locator('.pf-c-page'),
      page.locator('.navbar, nav')
    ];

    // Wait for at least one admin element to be visible
    let elementFound = false;
    for (const element of adminElements) {
      try {
        await expect(element).toBeVisible({ timeout: 10000 });
        elementFound = true;
        break;
      } catch (e) {
        // Continue to next element
      }
    }

    if (!elementFound) {
      // Fallback: check we're not on login page
      expect(page.url()).not.toContain('/protocol/openid-connect/auth');
    }

    console.log('✅ Successfully logged into Keycloak admin console');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const redirectUri = encodeURIComponent(config.baseUrl + 'admin/master/console/');
    const state = Date.now();
    const nonce = Date.now();
    const loginUrl =
      `${config.baseUrl}realms/master/protocol/openid-connect/auth?` +
      `client_id=security-admin-console&redirect_uri=${redirectUri}&state=${state}&` +
      `response_mode=query&response_type=code&scope=openid&nonce=${nonce}`;

    // Navigate to the Keycloak login page
    await page.goto(loginUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for the login page to load
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible({ timeout: 15000 });

    // Fill in invalid credentials
    await page.locator('input[name="username"]').fill('invaliduser');
    await page.locator('input[name="password"]').fill('wrongpassword');

    // Click the Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify error message is displayed
    const errorMessage = page.locator('#input-error, .pf-c-alert, [class*="error"]').first();
    await expect(errorMessage).toBeVisible({ timeout: 10000 });

    // Verify we're still on the login page
    expect(!page.url()).toContain('/protocol/openid-connect/auth');

    console.log('✅ Error message displayed for invalid credentials');
  });
});
