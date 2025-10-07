#!/usr/bin/env node

/**
 * Clean Lighthouse Reports Script
 *
 * This script removes all Lighthouse report files from the reports/lighthouse directory.
 * It can be used to clean up old performance reports before running new tests.
 * If the reports directory doesn't exist, it will be created automatically.
 *
 * Usage:
 *   node scripts/clean-lighthouse-reports.js
 *   npm run clean:lighthouse
 *
 * Options:
 *   --dry-run    Show what would be deleted without actually deleting
 *   --login      Only delete login page reports (keycloak-login-*)
 *   --console    Only delete console page reports (keycloak-console-*)
 *   --older-than Show only files older than X days (e.g. --older-than=7)
 *   --force      Skip interactive confirmation (useful for automated workflows)
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const loginOnly = args.includes('--login');
const consoleOnly = args.includes('--console');
const isForced = args.includes('--force');
const olderThanArg = args.find(arg => arg.startsWith('--older-than='));
const olderThanDays = olderThanArg ? parseInt(olderThanArg.split('=')[1]) : null;

const reportsDir = path.join(__dirname, '..', 'reports', 'lighthouse');

console.log('🧹 Lighthouse Reports Cleanup Tool');
console.log('==================================');

// Check if reports directory exists, create if it doesn't
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

// Get all files in the lighthouse reports directory
let files;
try {
  files = fs.readdirSync(reportsDir);
} catch (error) {
  console.error(`❌ Error reading directory: ${error.message}`);
  process.exit(1);
}

// Filter files based on options
let filesToDelete = files.filter(file => {
  // Only process lighthouse report files
  if (!file.startsWith('keycloak-') || (!file.endsWith('.html') && !file.endsWith('.json'))) {
    return false;
  }

  // Filter by type if specified
  if (loginOnly && !file.startsWith('keycloak-login-')) {
    return false;
  }
  if (consoleOnly && !file.startsWith('keycloak-console-')) {
    return false;
  }

  // Filter by age if specified
  if (olderThanDays !== null) {
    try {
      const filePath = path.join(reportsDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
      if (fileAge < olderThanDays) {
        return false;
      }
    } catch (error) {
      console.warn(`⚠️ Could not check age of file ${file}: ${error.message}`);
      return false;
    }
  }

  return true;
});

// Show what will be deleted
if (filesToDelete.length === 0) {
  console.log('✅ No files to delete based on current filters.');
  console.log(`📁 Reports directory: ${reportsDir}`);

  if (files.length > 0) {
    console.log(`📊 Current files in directory: ${files.length}`);
    files.forEach(file => {
      const filePath = path.join(reportsDir, file);
      const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
      const size = stats ? (stats.size / 1024).toFixed(1) + 'KB' : 'Unknown';
      const date = stats ? stats.mtime.toISOString().split('T')[0] : 'Unknown';
      console.log(`  • ${file} (${size}, ${date})`);
    });
  }
  process.exit(0);
}

console.log(`📋 Found ${filesToDelete.length} file(s) to delete:`);

// Calculate total size
let totalSize = 0;
filesToDelete.forEach(file => {
  const filePath = path.join(reportsDir, file);
  try {
    const stats = fs.statSync(filePath);
    const size = stats.size;
    const sizeKB = (size / 1024).toFixed(1);
    const date = stats.mtime.toISOString().split('T')[0];
    totalSize += size;

    console.log(`  • ${file} (${sizeKB}KB, ${date})`);
  } catch (error) {
    console.log(`  • ${file} (size unknown)`);
  }
});

const totalSizeKB = (totalSize / 1024).toFixed(1);
const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
console.log(`💾 Total size to be freed: ${totalSizeKB}KB (${totalSizeMB}MB)`);

// Show applied filters
if (loginOnly) console.log('🔍 Filter: Login reports only');
if (consoleOnly) console.log('🔍 Filter: Console reports only');
if (olderThanDays) console.log(`🔍 Filter: Files older than ${olderThanDays} days`);

if (isDryRun) {
  console.log('');
  console.log('🔍 DRY RUN MODE - No files will actually be deleted');
  console.log('Remove --dry-run flag to perform the actual deletion');
  process.exit(0);
}

// Confirm deletion (unless forced, in CI environment, or non-interactive)
if (!isForced && !process.env.CI && process.stdin.isTTY) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('\n❓ Proceed with deletion? (y/N): ', answer => {
    rl.close();

    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log('❌ Deletion cancelled');
      process.exit(0);
    }

    performDeletion();
  });
} else {
  // Auto-proceed when forced, in CI, or non-interactive environments
  if (isForced) {
    console.log('🚀 Force mode enabled - proceeding with deletion');
  }
  performDeletion();
}

function performDeletion() {
  console.log('');
  console.log('🗑️ Deleting files...');

  let deletedCount = 0;
  let errorCount = 0;

  filesToDelete.forEach(file => {
    const filePath = path.join(reportsDir, file);
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${file}`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Failed to delete ${file}: ${error.message}`);
      errorCount++;
    }
  });

  console.log('');
  console.log('📊 Cleanup Summary:');
  console.log(`  ✅ Successfully deleted: ${deletedCount} files`);
  if (errorCount > 0) {
    console.log(`  ❌ Failed to delete: ${errorCount} files`);
  }
  console.log(`  💾 Space freed: ${totalSizeKB}KB (${totalSizeMB}MB)`);

  // Check if directory is now empty
  const remainingFiles = fs
    .readdirSync(reportsDir)
    .filter(file => file.startsWith('keycloak-') && (file.endsWith('.html') || file.endsWith('.json')));

  if (remainingFiles.length === 0) {
    console.log('  🏁 Lighthouse reports directory is now clean');
  } else {
    console.log(`  📁 ${remainingFiles.length} report files remain`);
  }

  if (errorCount > 0) {
    process.exit(1);
  } else {
    console.log('');
    console.log('✅ Lighthouse reports cleanup completed successfully!');
  }
}
