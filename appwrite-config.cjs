// Database and Collection IDs
const DATABASE_ID = 'events_db';
const EVENTS_COLLECTION_ID = 'events';
const RSVPS_COLLECTION_ID = 'rsvps';

// Storage Bucket IDs
const COVERS_BUCKET_ID = 'event-covers';
const LOGOS_BUCKET_ID = 'event-logos';

// Event Collection Attributes
const EVENT_ATTRIBUTES = [
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
  { key: 'isPublic', type: 'boolean', required: false, default: true },
];

// RSVP Collection Attributes
const RSVP_ATTRIBUTES = [
  { key: 'eventId', type: 'string', required: true, size: 255 },
  { key: 'name', type: 'string', required: true, size: 255 },
  { key: 'email', type: 'string', required: true, size: 255 },
  { key: 'ticketId', type: 'string', required: true, size: 255 },
];

// Storage Bucket Permissions
const BUCKET_PERMISSIONS = {
  read: ['*'], // Public read access
  write: ['role:member'], // Only authenticated users can write
  delete: ['role:member'], // Only authenticated users can delete
};

// Database Permissions
const DATABASE_PERMISSIONS = {
  read: ['role:member'],
  write: ['role:member'],
  delete: ['role:member'],
};

module.exports = {
  DATABASE_ID,
  EVENTS_COLLECTION_ID,
  RSVPS_COLLECTION_ID,
  COVERS_BUCKET_ID,
  LOGOS_BUCKET_ID,
  EVENT_ATTRIBUTES,
  RSVP_ATTRIBUTES,
  BUCKET_PERMISSIONS,
  DATABASE_PERMISSIONS
};
