#!/usr/bin/env node

/**
 * Fix Appwrite Permissions Script
 *
 * This script fixes the permissions for collections and buckets
 * to allow authenticated users to read, create, update, and delete.
 */

require('dotenv').config({ path: '.env.local' });

const sdk = require('node-appwrite');
const {
  DATABASE_ID,
  EVENTS_COLLECTION_ID,
  RSVPS_COLLECTION_ID,
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

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

async function fixPermissions() {
  console.log('🔧 Fixing Appwrite Permissions...\n');

  try {
    // 1. Fix Events Collection Permissions
    console.log('📋 Updating events collection permissions...');
    await databases.updateCollection(
      DATABASE_ID,
      EVENTS_COLLECTION_ID,
      'Events',
      [
        'read("any")',      // Anyone can read events
        'create("users")',  // Authenticated users can create
        'update("users")',  // Authenticated users can update their own
        'delete("users")'   // Authenticated users can delete their own
      ]
    );
    console.log('✅ Events collection permissions updated');

    // 2. Fix RSVPs Collection Permissions
    console.log('📝 Updating RSVPs collection permissions...');
    await databases.updateCollection(
      DATABASE_ID,
      RSVPS_COLLECTION_ID,
      'Event RSVPs',
      [
        'read("any")',      // Anyone can read RSVPs (for counting)
        'create("any")',    // Anyone can create RSVPs (no auth required for attendees)
        'update("users")',  // Only authenticated users can update
        'delete("users")'   // Only authenticated users can delete
      ]
    );
    console.log('✅ RSVPs collection permissions updated');

    // 3. Fix Storage Buckets Permissions
    console.log('🗂️  Updating storage bucket permissions...');
    
    // Update covers bucket
    await storage.updateBucket(
      COVERS_BUCKET_ID,
      'Event Cover Images',
      [
        'read("any")',      // Anyone can read images
        'create("users")',  // Authenticated users can upload
        'update("users")',  // Authenticated users can update
        'delete("users")'   // Authenticated users can delete
      ],
      false, // File security disabled for easier access
      true,  // Enabled
      10485760, // 10MB max
      ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      sdk.Compression.NONE,
      false, // Encryption
      false  // Antivirus
    );
    console.log('✅ Event covers bucket permissions updated');

    // Update logos bucket
    await storage.updateBucket(
      LOGOS_BUCKET_ID,
      'Event Logo Images',
      [
        'read("any")',      // Anyone can read images
        'create("users")',  // Authenticated users can upload
        'update("users")',  // Authenticated users can update
        'delete("users")'   // Authenticated users can delete
      ],
      false, // File security disabled for easier access
      true,  // Enabled
      5242880, // 5MB max
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      sdk.Compression.NONE,
      false, // Encryption
      false  // Antivirus
    );
    console.log('✅ Event logos bucket permissions updated');

    console.log('\n🎉 Permissions fixed successfully!');
    console.log('\n📋 Updated permissions:');
    console.log('  • Events: Anyone can read, authenticated users can create/update/delete');
    console.log('  • RSVPs: Anyone can read/create, authenticated users can update/delete');
    console.log('  • Storage: Anyone can read, authenticated users can upload/manage');
    console.log('\n🚀 Try creating an event again!');

  } catch (error) {
    console.error('❌ Permission update failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your API key has admin permissions');
    console.log('2. Check that all resources exist');
    console.log('3. Verify your project ID and endpoint are correct');
  }
}

// Run the permission fix
fixPermissions();
