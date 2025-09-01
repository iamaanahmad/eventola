#!/usr/bin/env node

/**
 * Fix Storage File Access Permissions
 *
 * This script specifically fixes file access permissions for storage buckets
 * to ensure images can be accessed publicly.
 */

require('dotenv').config({ path: '.env.local' });

const sdk = require('node-appwrite');
const {
  COVERS_BUCKET_ID,
  LOGOS_BUCKET_ID
} = require('./appwrite-config.cjs');

// Environment variables
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || 'your-project-id';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || 'your-api-key';

const client = new sdk.Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const storage = new sdk.Storage(client);

async function fixStoragePermissions() {
  console.log('🔧 Fixing Storage File Access Permissions...\n');

  try {
    // Fix covers bucket with proper file access
    console.log('📸 Updating event-covers bucket for public file access...');
    await storage.updateBucket(
      COVERS_BUCKET_ID,
      'Event Cover Images',
      [
        'read("any")',      // Anyone can read files
        'create("users")',  // Authenticated users can upload
        'update("users")',  // Authenticated users can update
        'delete("users")'   // Authenticated users can delete
      ],
      false, // File security OFF - this is key for public access
      true,  // Enabled
      10485760, // 10MB max
      ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      sdk.Compression.NONE,
      false, // Encryption OFF
      false  // Antivirus OFF
    );
    console.log('✅ Event covers bucket updated for public access');

    // Fix logos bucket with proper file access
    console.log('🎨 Updating event-logos bucket for public file access...');
    await storage.updateBucket(
      LOGOS_BUCKET_ID,
      'Event Logo Images',
      [
        'read("any")',      // Anyone can read files
        'create("users")',  // Authenticated users can upload
        'update("users")',  // Authenticated users can update
        'delete("users")'   // Authenticated users can delete
      ],
      false, // File security OFF - this is key for public access
      true,  // Enabled
      5242880, // 5MB max
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      sdk.Compression.NONE,
      false, // Encryption OFF
      false  // Antivirus OFF
    );
    console.log('✅ Event logos bucket updated for public access');

    console.log('\n🎉 Storage permissions fixed successfully!');
    console.log('\n📋 Key changes:');
    console.log('  • File security disabled for public access');
    console.log('  • Anyone can read uploaded files');
    console.log('  • Authenticated users can manage files');
    console.log('\n🚀 Images should now load properly!');

  } catch (error) {
    console.error('❌ Storage permission update failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your API key has admin permissions');
    console.log('2. Check that storage buckets exist');
    console.log('3. Try refreshing your browser after the fix');
  }
}

// Run the storage permission fix
fixStoragePermissions();
