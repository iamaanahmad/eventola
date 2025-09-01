import { databases, storage } from '@/lib/appwrite';

// Database and Collection IDs
export const DATABASE_ID = 'events_db';
export const EVENTS_COLLECTION_ID = 'events';
export const RSVPS_COLLECTION_ID = 'rsvps';

// Storage Bucket IDs
export const COVERS_BUCKET_ID = 'event-covers';
export const LOGOS_BUCKET_ID = 'event-logos';

// Event Collection Attributes
export const EVENT_ATTRIBUTES = [
  { key: 'ownerUserId', type: 'string', required: true, size: 255 },
  { key: 'title', type: 'string', required: true, size: 255 },
  { key: 'slug', type: 'string', required: true, size: 255 },
  { key: 'description', type: 'string', required: true, size: 10000 },
  { key: 'location', type: 'string', required: true, size: 500 },
  { key: 'startAt', type: 'datetime', required: true },
  { key: 'endAt', type: 'datetime', required: true },
  { key: 'coverFileId', type: 'string', required: false, size: 255 },
  { key: 'logoFileId', type: 'string', required: false, size: 255 },
  { key: 'status', type: 'string', required: true, size: 50 },
  { key: 'theme', type: 'string', required: true, size: 50 },
];

// RSVP Collection Attributes
export const RSVP_ATTRIBUTES = [
  { key: 'eventId', type: 'string', required: true, size: 255 },
  { key: 'name', type: 'string', required: true, size: 255 },
  { key: 'email', type: 'string', required: true, size: 255 },
  { key: 'ticketId', type: 'string', required: true, size: 255 },
];

// Storage Bucket Permissions
export const BUCKET_PERMISSIONS = {
  read: ['*'], // Public read access
  write: ['role:member'], // Only authenticated users can write
  delete: ['role:member'], // Only authenticated users can delete
};

// Database Permissions
export const DATABASE_PERMISSIONS = {
  read: ['role:member'],
  write: ['role:member'],
  delete: ['role:member'],
};
