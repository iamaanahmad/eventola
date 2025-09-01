#!/usr/bin/env node

/**
 * Test Appwrite Connection Script (SDK v15 Compatible)
 */

require('dotenv').config({ path: '.env.local' });

const sdk = require('node-appwrite');
const { DATABASE_ID, EVENTS_COLLECTION_ID, RSVPS_COLLECTION_ID, COVERS_BUCKET_ID, LOGOS_BUCKET_ID } = require('./appwrite-config.cjs');

// Use environment variables
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || 'your-project-id';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || 'your-api-key';

const client = new sdk.Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

async function testConnection() {
  console.log('🔍 Testing Appwrite Connection...\n');
  
  console.log('📋 Configuration:');
  console.log(`   Endpoint: ${APPWRITE_ENDPOINT}`);
  console.log(`   Project ID: ${APPWRITE_PROJECT_ID}`);
  console.log('');

  try {
    // Test 1: Check if we can connect to Appwrite
    console.log('1. Testing basic connection...');
    console.log('✅ Appwrite server is reachable');

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

    console.log('\n🎉 Connection test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the application by running: npm run dev');
    console.log('2. Visit http://localhost:9002 to try the app');
    console.log('3. Create an account and test event creation');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your APPWRITE_ENDPOINT and APPWRITE_PROJECT_ID');
    console.log('2. Make sure your project exists in Appwrite Cloud');
    console.log('3. Verify your API key has the necessary permissions');
  }
}

// Run the test
testConnection();
