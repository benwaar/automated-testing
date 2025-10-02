import { test, expect, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Load configuration based on environment
function loadConfig() {
  const env = process.env.NODE_ENV || 'local';
  const configPath = path.join(__dirname, '..', 'config', `${env}.json`);

  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  // Fallback to local config
  const localConfigPath = path.join(__dirname, '..', 'config', 'local.json');
  return JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
}

interface Config {
  baseUrl: string;
  username: string;
  password: string;
}

test.describe('Keycloak Login Page - Lighthouse Audits', () => {
  let config: Config;

  test.beforeEach(async () => {
    config = loadConfig();
  });

  // Skip Lighthouse tests for non-Chromium browsers
  test.skip(({ browserName }) => browserName !== 'chromium', 'Lighthouse only supports Chromium');

  test('should audit Keycloak login page performance and accessibility', async () => {
    // Launch browser with debugging enabled
    const browser = await chromium.launch({
      args: ['--remote-debugging-port=9222']
    });

    const page = await browser.newPage();

    try {
      // Navigate to Keycloak login page
      const redirectUri = encodeURIComponent(config.baseUrl + 'admin/master/console/');
      const state = Date.now();
      const nonce = Date.now();
      const loginUrl =
        `${config.baseUrl}realms/master/protocol/openid-connect/auth?` +
        `client_id=security-admin-console&redirect_uri=${redirectUri}&state=${state}&` +
        `response_mode=query&response_type=code&scope=openid&nonce=${nonce}`;

      console.log('🔗 Navigating to Keycloak login page for Lighthouse audit...');
      await page.goto(loginUrl, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for the login form to be visible
      await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible({
        timeout: 15000
      });

      console.log('🔍 Running Lighthouse audit on login page...');

      // Dynamic import for playwright-lighthouse
      const { playAudit } = await import('playwright-lighthouse');

      // Run Lighthouse audit using the existing page with custom thresholds
      const lighthouseReport = await playAudit({
        page,
        port: 9222,
        thresholds: {
          performance: 30, // 30% minimum for performance
          accessibility: 70, // 70% minimum for accessibility
          'best-practices': 70, // 70% minimum for best practices
          seo: 30, // 30% minimum for SEO (login pages typically score lower)
          pwa: 20 // 20% minimum for PWA features
        }
      });

      // Create reports directory if it doesn't exist
      const reportsDir = path.join(__dirname, '..', '..', 'reports', 'lighthouse');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      // Save Lighthouse report if available
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportPath = path.join(reportsDir, `keycloak-login-${timestamp}.json`);

      if (lighthouseReport && lighthouseReport.lhr) {
        fs.writeFileSync(reportPath, JSON.stringify(lighthouseReport.lhr, null, 2));
        console.log(`📊 Lighthouse report saved: ${reportPath}`);
      }

      // Performance assertions with null checks
      const performanceScore = lighthouseReport.lhr.categories.performance?.score;
      if (performanceScore !== null && performanceScore !== undefined) {
        expect(performanceScore).toBeGreaterThanOrEqual(0.3); // 30% - very lenient
        console.log(`⚡ Performance Score: ${Math.round(performanceScore * 100)}%`);
      }

      // Accessibility assertions with null checks
      const accessibilityScore = lighthouseReport.lhr.categories.accessibility?.score;
      if (accessibilityScore !== null && accessibilityScore !== undefined) {
        expect(accessibilityScore).toBeGreaterThanOrEqual(0.7); // 70%
        console.log(`♿ Accessibility Score: ${Math.round(accessibilityScore * 100)}%`);
      }

      // Core Web Vitals checks with safe access
      const firstContentfulPaint = lighthouseReport.lhr.audits['first-contentful-paint']?.numericValue;
      const largestContentfulPaint = lighthouseReport.lhr.audits['largest-contentful-paint']?.numericValue;

      if (firstContentfulPaint) {
        console.log(`🎨 First Contentful Paint: ${Math.round(firstContentfulPaint)}ms`);
        expect(firstContentfulPaint).toBeLessThan(15000); // < 15s - realistic for Keycloak
      }

      if (largestContentfulPaint) {
        console.log(`🖼️ Largest Contentful Paint: ${Math.round(largestContentfulPaint)}ms`);
        expect(largestContentfulPaint).toBeLessThan(20000); // < 20s - realistic for Keycloak
      }

      console.log('✅ Lighthouse audit completed successfully!');
    } finally {
      await page.close();
      await browser.close();
    }
  });
});
