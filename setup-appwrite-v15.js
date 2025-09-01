#!/usr/bin/env node

/**
 * Appwrite Database Setup Script (SDK v15 Compatible)
 *
 * This script helps you set up the required database, collections, and storage buckets
 * for the Eventola application using Appwrite SDK v15.
 */

require('dotenv').config({ path: '.env.local' });

const sdk = require('node-appwrite');
const {
  DATABASE_ID,
  EVENTS_COLLECTION_ID,
  RSVPS_COLLECTION_ID,
  COVERS_BUCKET_ID,
  LOGOS_BUCKET_ID,
  EVENT_ATTRIBUTES,
  RSVP_ATTRIBUTES,
  BUCKET_PERMISSIONS,
  DATABASE_PERMISSIONS
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

async function setupDatabase() {
  console.log('🚀 Setting up Eventola Appwrite Backend...\n');

  try {
    // 1. Create Database
    console.log('📊 Creating database...');
    await databases.create(DATABASE_ID, 'Eventola Events Database');
    console.log('✅ Database created successfully\n');

    // 2. Create Events Collection
    console.log('📋 Creating events collection...');
    await databases.createCollection(
      DATABASE_ID,
      EVENTS_COLLECTION_ID,
      'Events'
    );

    // Add attributes to Events collection
    console.log('🔧 Adding attributes to events collection...');
    for (const attr of EVENT_ATTRIBUTES) {
      if (attr.type === 'string') {
        await databases.createStringAttribute(
          DATABASE_ID,
          EVENTS_COLLECTION_ID,
          attr.key,
          attr.size,
          attr.required,
          attr.default || undefined
        );
      } else if (attr.type === 'datetime') {
        await databases.createDatetimeAttribute(
          DATABASE_ID,
          EVENTS_COLLECTION_ID,
          attr.key,
          attr.required
        );
      }
      console.log(`  ✅ Added ${attr.key} attribute`);
    }

    // 3. Create RSVPs Collection
    console.log('\n📝 Creating RSVPs collection...');
    await databases.createCollection(
      DATABASE_ID,
      RSVPS_COLLECTION_ID,
      'Event RSVPs'
    );

    // Add attributes to RSVPs collection
    console.log('🔧 Adding attributes to RSVPs collection...');
    for (const attr of RSVP_ATTRIBUTES) {
      await databases.createStringAttribute(
        DATABASE_ID,
        RSVPS_COLLECTION_ID,
        attr.key,
        attr.size,
        attr.required
      );
      console.log(`  ✅ Added ${attr.key} attribute`);
    }

    // 4. Create Storage Buckets
    console.log('\n🗂️  Creating storage buckets...');

    // Event Covers Bucket
    console.log('📸 Creating event-covers bucket...');
    await storage.createBucket(
      COVERS_BUCKET_ID,
      'Event Cover Images',
      ['read("any")'], // Permissions
      false, // File security
      true, // Enabled
      10485760, // 10MB max file size
      ['jpg', 'jpeg', 'png', 'gif', 'webp'], // Allowed extensions
      sdk.Compression.NONE,
      false, // Encryption
      false // Antivirus
    );

    // Event Logos Bucket
    console.log('🎨 Creating event-logos bucket...');
    await storage.createBucket(
      LOGOS_BUCKET_ID,
      'Event Logo Images',
      ['read("any")'], // Permissions
      false, // File security
      true, // Enabled
      5242880, // 5MB max file size
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'], // Allowed extensions
      sdk.Compression.NONE,
      false, // Encryption
      false // Antivirus
    );

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`  • Database: ${DATABASE_ID}`);
    console.log(`  • Events Collection: ${EVENTS_COLLECTION_ID}`);
    console.log(`  • RSVPs Collection: ${RSVPS_COLLECTION_ID}`);
    console.log(`  • Cover Images Bucket: ${COVERS_BUCKET_ID}`);
    console.log(`  • Logo Images Bucket: ${LOGOS_BUCKET_ID}`);
    console.log('\n🚀 Your Eventola backend is ready to use!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your Appwrite project is set up correctly');
    console.log('2. Check that your API key has the necessary permissions');
    console.log('3. Verify your endpoint and project ID are correct');
    console.log('4. Some resources might already exist (this is normal)');
  }
}

// Run the setup
setupDatabase();
