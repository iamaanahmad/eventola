#!/usr/bin/env node

/**
 * Test Appwrite Connection Script
 *
 * This script tests the Appwrite connection and verifies that the database
 * and collections are set up correctly.
 */

require('dotenv').config({ path: '.env.local' });

const { Client, Databases, Storage, Account } = require('appwrite');
const { DATABASE_ID, EVENTS_COLLECTION_ID, RSVPS_COLLECTION_ID, COVERS_BUCKET_ID, LOGOS_BUCKET_ID } = require('./appwrite-config.cjs');

// Use environment variables or the config file
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || 'your-project-id';

const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);

async function testConnection() {
  console.log('🔍 Testing Appwrite Connection...\n');
  
  console.log('📋 Configuration:');
  console.log(`   Endpoint: ${APPWRITE_ENDPOINT}`);
  console.log(`   Project ID: ${APPWRITE_PROJECT_ID}`);
  console.log('');

  try {
    // Test 1: Check if we can connect to Appwrite
    console.log('1. Testing basic connection...');
    try {
      // Try to get project info instead of health endpoint
      const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID);
      
      const account = new Account(client);
      await account.get(); // This will fail but tell us if project exists
      console.log('✅ User authenticated (unexpected)');
    } catch (error) {
      if (error.code === 401) {
        console.log('✅ Appwrite server is reachable (401 expected for unauthenticated user)');
      } else if (error.code === 404) {
        console.log('❌ Project not found. Check your APPWRITE_PROJECT_ID');
        throw error;
      } else {
        console.log(`✅ Appwrite server is reachable (error: ${error.code})`);
      }
    }

    // Test 2: Check database exists
    console.log('\n2. Testing database access...');
    try {
      const dbInfo = await databases.get(DATABASE_ID);
      console.log(`✅ Database "${dbInfo.name}" found`);
    } catch (error) {
      console.log(`❌ Database "${DATABASE_ID}" not found or not accessible`);
      console.log('   Make sure the database exists and you have proper permissions');
    }

    // Test 3: Check collections exist
    console.log('\n3. Testing collections...');
    const collections = [
      { id: EVENTS_COLLECTION_ID, name: 'Events' },
      { id: RSVPS_COLLECTION_ID, name: 'RSVPs' }
    ];

    for (const collection of collections) {
      try {
        const collInfo = await databases.getCollection(DATABASE_ID, collection.id);
        console.log(`✅ Collection "${collInfo.name}" (${collection.id}) found`);
      } catch (error) {
        console.log(`❌ Collection "${collection.name}" (${collection.id}) not found`);
      }
    }

    // Test 4: Check storage buckets exist
    console.log('\n4. Testing storage buckets...');
    const buckets = [
      { id: COVERS_BUCKET_ID, name: 'Event Covers' },
      { id: LOGOS_BUCKET_ID, name: 'Event Logos' }
    ];

    for (const bucket of buckets) {
      try {
        const bucketInfo = await storage.getBucket(bucket.id);
        console.log(`✅ Bucket "${bucketInfo.name}" (${bucket.id}) found`);
      } catch (error) {
        console.log(`❌ Bucket "${bucket.name}" (${bucket.id}) not found`);
      }
    }

    // Test 5: Check authentication
    console.log('\n5. Testing authentication...');
    try {
      // This will fail if no session exists, which is expected
      await account.get();
      console.log('✅ User is authenticated');
    } catch (error) {
      console.log('ℹ️  No active session (expected for server-side testing)');
    }

    console.log('\n🎉 Connection test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. If any resources are missing, run: node setup-appwrite.js');
    console.log('2. Make sure your environment variables are set correctly');
    console.log('3. Test the application by running: npm run dev');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your APPWRITE_ENDPOINT and APPWRITE_PROJECT_ID');
    console.log('2. Make sure your project exists in Appwrite Cloud');
    console.log('3. Verify your network connection to Appwrite');
  }
}

// Run the test
testConnection();
