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

      // Determine report format from environment variable
      const reportFormat = process.env.LIGHTHOUSE_FORMAT || 'json';

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
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      if (lighthouseReport && lighthouseReport.lhr) {
        if (reportFormat === 'html') {
          try {
            // Generate HTML report using Lighthouse's ReportGenerator
            const { ReportGenerator } = await import('lighthouse/report/generator/report-generator.js');
            const htmlReport = ReportGenerator.generateReport(lighthouseReport.lhr, 'html');
            const htmlReportPath = path.join(reportsDir, `keycloak-login-${timestamp}.html`);
            const htmlContent = Array.isArray(htmlReport) ? htmlReport[0] : htmlReport;
            fs.writeFileSync(htmlReportPath, htmlContent);
            console.log(`📊 Lighthouse HTML report saved: ${htmlReportPath}`);
          } catch (error) {
            console.warn('⚠️ HTML report generation failed, saving JSON instead:', error);
            const jsonReportPath = path.join(reportsDir, `keycloak-login-${timestamp}.json`);
            fs.writeFileSync(jsonReportPath, JSON.stringify(lighthouseReport.lhr, null, 2));
            console.log(`📊 Lighthouse JSON report saved: ${jsonReportPath}`);
          }
        } else {
          // Save JSON report (default)
          const jsonReportPath = path.join(reportsDir, `keycloak-login-${timestamp}.json`);
          fs.writeFileSync(jsonReportPath, JSON.stringify(lighthouseReport.lhr, null, 2));
          console.log(`📊 Lighthouse JSON report saved: ${jsonReportPath}`);
        }
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

  test('should audit Keycloak admin console performance and accessibility after login', async () => {
    test.setTimeout(120000); // Increase timeout to 2 minutes for admin console audit
    // Launch browser with debugging enabled
    const browser = await chromium.launch({
      args: ['--remote-debugging-port=9223'] // Different port to avoid conflicts
    });

    const page = await browser.newPage();

    try {
      console.log('🔍 Starting Lighthouse audit for admin console after login...');

      // Navigate to login page first
      const redirectUri = encodeURIComponent(config.baseUrl + 'admin/master/console/');
      const state = Date.now();
      const nonce = Date.now();
      const loginUrl =
        `${config.baseUrl}realms/master/protocol/openid-connect/auth?` +
        `client_id=security-admin-console&redirect_uri=${redirectUri}&state=${state}&` +
        `response_mode=query&response_type=code&scope=openid&nonce=${nonce}`;

      console.log('📍 Navigating to login page...');
      await page.goto(loginUrl, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for the login form and perform login
      await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible({
        timeout: 15000
      });

      console.log('🔐 Performing login...');
      await page.fill('#username', config.username);
      await page.fill('#password', config.password);
      await page.click('#kc-login');

      // Wait for redirect to admin console
      console.log('⏳ Waiting for redirect to admin console...');

      try {
        // Wait for URL to contain admin console path
        await page.waitForURL('**/admin/master/console/**', {
          waitUntil: 'networkidle',
          timeout: 30000
        });
      } catch (error) {
        // If waitForURL fails, check if we're already on the console page
        const currentUrl = page.url();
        console.log(`Current URL after login: ${currentUrl}`);
        if (!currentUrl.includes('/admin/master/console')) {
          throw new Error(`Failed to redirect to admin console. Current URL: ${currentUrl}`);
        }
      }

      // Wait for console elements to be visible (more reliable than timeout)
      try {
        await page.locator('.pf-c-masthead, .navbar, [data-testid="help-dropdown"]').first().waitFor({
          state: 'visible',
          timeout: 15000
        });
      } catch (error) {
        console.log('Admin console elements not found, waiting with timeout...');
        await page.waitForTimeout(5000);
      }

      console.log('✅ Admin console loaded successfully');

      // Dynamic import for playwright-lighthouse
      const { playAudit } = await import('playwright-lighthouse');

      // Determine report format from environment variable
      const reportFormat = process.env.LIGHTHOUSE_FORMAT || 'json';

      console.log('🔍 Running Lighthouse audit on admin console...');

      // Run Lighthouse audit on the loaded admin console with optimized settings
      const lighthouseReport = await playAudit({
        page,
        port: 9223,
        thresholds: {
          performance: 25, // Lower threshold for admin console (complex UI)
          accessibility: 65, // Slightly lower for admin interface
          'best-practices': 65,
          seo: 20, // SEO less important for admin console
          pwa: 15 // PWA features less important for admin
        },
        opts: {
          onlyCategories: ['performance', 'accessibility', 'best-practices'], // Skip SEO and PWA for faster audit
          formFactor: 'desktop',
          throttlingMethod: 'simulate', // Use simulation for faster results
          screenEmulation: { disabled: true } // Disable screen emulation for speed
        }
      });

      // Create reports directory if it doesn't exist
      const reportsDir = path.join(__dirname, '..', '..', 'reports', 'lighthouse');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      if (lighthouseReport && lighthouseReport.lhr) {
        if (reportFormat === 'html') {
          try {
            // Generate HTML report using Lighthouse's ReportGenerator
            const { ReportGenerator } = await import('lighthouse/report/generator/report-generator.js');
            const htmlReport = ReportGenerator.generateReport(lighthouseReport.lhr, 'html');
            const htmlReportPath = path.join(reportsDir, `keycloak-console-${timestamp}.html`);
            const htmlContent = Array.isArray(htmlReport) ? htmlReport[0] : htmlReport;
            fs.writeFileSync(htmlReportPath, htmlContent);
            console.log(`📊 Console Lighthouse HTML report saved: ${htmlReportPath}`);
          } catch (error) {
            console.warn('⚠️ Console HTML report generation failed, saving JSON instead:', error);
            const jsonReportPath = path.join(reportsDir, `keycloak-console-${timestamp}.json`);
            fs.writeFileSync(jsonReportPath, JSON.stringify(lighthouseReport.lhr, null, 2));
            console.log(`📊 Console Lighthouse JSON report saved: ${jsonReportPath}`);
          }
        } else {
          // Save JSON report (default)
          const jsonReportPath = path.join(reportsDir, `keycloak-console-${timestamp}.json`);
          fs.writeFileSync(jsonReportPath, JSON.stringify(lighthouseReport.lhr, null, 2));
          console.log(`📊 Console Lighthouse JSON report saved: ${jsonReportPath}`);
        }
      }

      // Performance assertions with null checks (more lenient for admin console)
      const performanceScore = lighthouseReport.lhr.categories.performance?.score;
      if (performanceScore !== null && performanceScore !== undefined) {
        expect(performanceScore).toBeGreaterThanOrEqual(0.25); // 25% - very lenient for admin UI
        console.log(`⚡ Console Performance Score: ${Math.round(performanceScore * 100)}%`);
      }

      // Accessibility assertions with null checks
      const accessibilityScore = lighthouseReport.lhr.categories.accessibility?.score;
      if (accessibilityScore !== null && accessibilityScore !== undefined) {
        expect(accessibilityScore).toBeGreaterThanOrEqual(0.65); // 65% - slightly lower for admin
        console.log(`♿ Console Accessibility Score: ${Math.round(accessibilityScore * 100)}%`);
      }

      // Core Web Vitals checks with more lenient thresholds for admin console
      const firstContentfulPaint = lighthouseReport.lhr.audits['first-contentful-paint']?.numericValue;
      const largestContentfulPaint = lighthouseReport.lhr.audits['largest-contentful-paint']?.numericValue;

      if (firstContentfulPaint) {
        console.log(`🎨 Console First Contentful Paint: ${Math.round(firstContentfulPaint)}ms`);
        expect(firstContentfulPaint).toBeLessThan(25000); // < 25s - more lenient for admin console
      }

      if (largestContentfulPaint) {
        console.log(`🖼️ Console Largest Contentful Paint: ${Math.round(largestContentfulPaint)}ms`);
        expect(largestContentfulPaint).toBeLessThan(30000); // < 30s - more lenient for admin console
      }

      console.log('✅ Console Lighthouse audit completed successfully!');
    } finally {
      await page.close();
      await browser.close();
    }
  });
});
