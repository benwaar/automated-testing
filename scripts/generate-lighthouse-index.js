#!/usr/bin/env node

/**
 * Generate Lighthouse Reports Index
 *
 * This script creates an index.html file in the reports/lighthouse directory
 * that provides a user-friendly interface to browse and access all lighthouse reports.
 * It automatically discovers HTML and JSON reports and organizes them by type and date.
 *
 * Usage:
 *   node scripts/generate-lighthouse-index.js
 *   npm run lighthouse:index
 *
 * Options:
 *   --auto-open  Automatically open the index.html in the default browser after generation
 *   --title      Custom title for the index page (default: "Lighthouse Reports")
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const autoOpen = args.includes('--auto-open');
const titleArg = args.find(arg => arg.startsWith('--title='));
const customTitle = titleArg ? titleArg.split('=')[1] : 'Lighthouse Reports';

const reportsDir = path.join(__dirname, '..', 'reports', 'lighthouse');
const indexPath = path.join(reportsDir, 'index.html');

console.log('📊 Lighthouse Reports Index Generator');
console.log('====================================');

// Check if reports directory exists
if (!fs.existsSync(reportsDir)) {
  console.log(`📁 Reports directory not found: ${reportsDir}`);
  console.log('📁 Creating reports directory...');
  try {
    fs.mkdirSync(reportsDir, { recursive: true });
    console.log(`✅ Created reports directory: ${reportsDir}`);
  } catch (error) {
    console.error(`❌ Failed to create reports directory: ${error.message}`);
    process.exit(1);
  }
}

// Get all report files
let files;
try {
  files = fs.readdirSync(reportsDir);
} catch (error) {
  console.error(`❌ Error reading directory: ${error.message}`);
  process.exit(1);
}

// Filter and categorize lighthouse report files
const reports = files
  .filter(file => {
    // Only process lighthouse report files, exclude index.html
    return file.startsWith('keycloak-') && (file.endsWith('.html') || file.endsWith('.json')) && file !== 'index.html';
  })
  .map(file => {
    const filePath = path.join(reportsDir, file);
    let stats;
    try {
      stats = fs.statSync(filePath);
    } catch (error) {
      console.warn(`⚠️ Could not get stats for ${file}: ${error.message}`);
      return null;
    }

    // Parse filename to extract information
    const isLoginReport = file.startsWith('keycloak-login-');
    const isConsoleReport = file.startsWith('keycloak-console-');
    const isHtmlReport = file.endsWith('.html');
    const isJsonReport = file.endsWith('.json');

    // Extract timestamp from filename
    const timestampMatch = file.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)/);
    const timestamp = timestampMatch ? timestampMatch[1] : '';

    // Convert timestamp to readable date
    let readableDate = 'Unknown';
    if (timestamp) {
      try {
        const isoTimestamp = timestamp.replace(/-/g, ':').replace('T', 'T').slice(0, -1) + 'Z';
        const date = new Date(isoTimestamp.substring(0, 19) + 'Z');
        readableDate = date.toLocaleString();
      } catch (error) {
        readableDate = timestamp;
      }
    }

    return {
      filename: file,
      type: isLoginReport ? 'login' : isConsoleReport ? 'console' : 'unknown',
      format: isHtmlReport ? 'html' : isJsonReport ? 'json' : 'unknown',
      timestamp,
      readableDate,
      size: stats.size,
      sizeKB: (stats.size / 1024).toFixed(1),
      sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
      modified: stats.mtime
    };
  })
  .filter(report => report !== null)
  .sort((a, b) => b.modified - a.modified); // Sort by modification date, newest first

console.log(`📋 Found ${reports.length} lighthouse report(s)`);

// Group reports by type and format
const loginReports = reports.filter(r => r.type === 'login');
const consoleReports = reports.filter(r => r.type === 'console');
const htmlReports = reports.filter(r => r.format === 'html');
const jsonReports = reports.filter(r => r.format === 'json');

// Calculate total size
const totalSize = reports.reduce((sum, report) => sum + report.size, 0);
const totalSizeKB = (totalSize / 1024).toFixed(1);
const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

console.log(`📊 Report breakdown:`);
console.log(`  • Login reports: ${loginReports.length}`);
console.log(`  • Console reports: ${consoleReports.length}`);
console.log(`  • HTML reports: ${htmlReports.length}`);
console.log(`  • JSON reports: ${jsonReports.length}`);
console.log(`  • Total size: ${totalSizeKB}KB (${totalSizeMB}MB)`);

// Generate HTML content
const generateReportCard = report => `
    <div class="report-card">
      <div class="report-header">
        <h3>${report.type === 'login' ? '🔐 Login Page' : '🖥️ Admin Console'} Report</h3>
        <span class="report-format ${report.format}">${report.format.toUpperCase()}</span>
      </div>
      <div class="report-details">
        <p><strong>Generated:</strong> ${report.readableDate}</p>
        <p><strong>File Size:</strong> ${report.sizeKB}KB</p>
        <p><strong>File Name:</strong> <code>${report.filename}</code></p>
      </div>
      <div class="report-actions">
        <a href="${report.filename}" class="btn btn-primary" ${report.format === 'html' ? '' : 'download'}>
          ${report.format === 'html' ? '👁️ View Report' : '💾 Download JSON'}
        </a>
        ${report.format === 'html' ? `<a href="${report.filename}" class="btn btn-secondary" target="_blank">🔗 Open in New Tab</a>` : ''}
      </div>
    </div>`;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${customTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #ff6b6b, #feca57);
            color: white;
            padding: 2rem;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            padding: 2rem;
            background: #f8f9fa;
        }

        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #667eea;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            color: #666;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .content {
            padding: 2rem;
        }

        .section {
            margin-bottom: 3rem;
        }

        .section h2 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 0.5rem;
        }

        .reports-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }

        .report-card {
            background: white;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .report-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .report-header {
            background: #f8f9fa;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e1e5e9;
        }

        .report-header h3 {
            font-size: 1.1rem;
            color: #333;
        }

        .report-format {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: bold;
            text-transform: uppercase;
        }

        .report-format.html {
            background: #28a745;
            color: white;
        }

        .report-format.json {
            background: #17a2b8;
            color: white;
        }

        .report-details {
            padding: 1rem;
        }

        .report-details p {
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        .report-details code {
            background: #f8f9fa;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.8rem;
            color: #e83e8c;
        }

        .report-actions {
            padding: 1rem;
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
            flex: 1;
            min-width: 120px;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-primary:hover {
            background: #5a67d8;
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
        }

        .btn-secondary:hover {
            background: #545b62;
        }

        .empty-state {
            text-align: center;
            padding: 3rem;
            color: #666;
        }

        .empty-state h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .footer {
            background: #f8f9fa;
            padding: 1rem 2rem;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
            border-top: 1px solid #e1e5e9;
        }

        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }

            .header {
                padding: 1.5rem;
            }

            .header h1 {
                font-size: 2rem;
            }

            .stats {
                grid-template-columns: repeat(2, 1fr);
                padding: 1rem;
            }

            .content {
                padding: 1rem;
            }

            .reports-grid {
                grid-template-columns: 1fr;
            }

            .report-actions {
                flex-direction: column;
            }

            .btn {
                flex: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 ${customTitle}</h1>
            <p>Performance and accessibility audit results for Keycloak</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${reports.length}</div>
                <div class="stat-label">Total Reports</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${loginReports.length}</div>
                <div class="stat-label">Login Page Reports</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${consoleReports.length}</div>
                <div class="stat-label">Console Reports</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalSizeMB}MB</div>
                <div class="stat-label">Total Size</div>
            </div>
        </div>

        <div class="content">
            ${
              reports.length === 0
                ? `
                <div class="empty-state">
                    <h3>📭 No Reports Found</h3>
                    <p>No lighthouse reports have been generated yet.</p>
                    <p>Run <code>npm run test:lighthouse:local:html</code> to generate your first report!</p>
                </div>
            `
                : `
                ${
                  loginReports.length > 0
                    ? `
                    <div class="section">
                        <h2>🔐 Login Page Reports</h2>
                        <div class="reports-grid">
                            ${loginReports.map(generateReportCard).join('')}
                        </div>
                    </div>
                `
                    : ''
                }

                ${
                  consoleReports.length > 0
                    ? `
                    <div class="section">
                        <h2>🖥️ Admin Console Reports</h2>
                        <div class="reports-grid">
                            ${consoleReports.map(generateReportCard).join('')}
                        </div>
                    </div>
                `
                    : ''
                }
            `
            }
        </div>

        <div class="footer">
            <p>Generated on ${new Date().toLocaleString()} • 
               <a href="https://developers.google.com/web/tools/lighthouse" target="_blank">Powered by Lighthouse</a>
            </p>
        </div>
    </div>
</body>
</html>`;

// Write the index.html file
try {
  fs.writeFileSync(indexPath, htmlContent);
  console.log(`📄 Generated index.html: ${indexPath}`);
} catch (error) {
  console.error(`❌ Failed to write index.html: ${error.message}`);
  process.exit(1);
}

// Auto-open if requested
if (autoOpen) {
  console.log('🌐 Opening index.html in default browser...');
  try {
    const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    execSync(`${command} "${indexPath}"`);
  } catch (error) {
    console.warn(`⚠️ Could not auto-open browser: ${error.message}`);
    console.log(`🔗 Manually open: file://${indexPath}`);
  }
}

console.log('');
console.log('✅ Lighthouse reports index generated successfully!');
console.log(`🔗 Open in browser: file://${indexPath}`);

// Show quick access info
if (reports.length > 0) {
  console.log('');
  console.log('📋 Quick Access:');
  const recentReports = reports.slice(0, 3);
  recentReports.forEach((report, index) => {
    const icon = report.type === 'login' ? '🔐' : '🖥️';
    const format = report.format.toUpperCase();
    console.log(`  ${index + 1}. ${icon} ${report.type} (${format}) - ${report.readableDate}`);
  });
  if (reports.length > 3) {
    console.log(`  ... and ${reports.length - 3} more reports`);
  }
}
