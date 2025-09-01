# 🚀 Manual Appwrite Setup Guide

Since the automated setup script has some compatibility issues with the current Appwrite SDK version, please follow these manual setup steps in your Appwrite Console:

## 📋 Setup Steps

### 1. Login to Appwrite Console
- Go to https://cloud.appwrite.io
- Login with your account
- Select your project: **Eventola** (Project ID: `68b517b6002ec0a0ba8f`)

### 2. Enable Authentication
- Go to **Authentication** → **Settings**
- Enable **Email/Password** authentication method
- Save changes

### 3. Create Database
- Go to **Databases**
- Click **Create Database**
- Database ID: `events_db`
- Name: `Eventola Events Database`

### 4. Create Events Collection
- Inside the `events_db` database, click **Create Collection**
- Collection ID: `events`
- Name: `Events`

**Add these attributes to the Events collection:**
```
ownerUserId     | String    | Size: 255   | Required: Yes
title          | String    | Size: 255   | Required: Yes  
slug           | String    | Size: 255   | Required: Yes
description    | String    | Size: 10000 | Required: Yes
location       | String    | Size: 500   | Required: Yes
startAt        | DateTime  |             | Required: Yes
endAt          | DateTime  |             | Required: Yes
coverFileId    | String    | Size: 255   | Required: No
logoFileId     | String    | Size: 255   | Required: No
status         | String    | Size: 50    | Required: Yes
theme          | String    | Size: 50    | Required: Yes
```

### 5. Create RSVPs Collection
- Click **Create Collection**
- Collection ID: `rsvps`
- Name: `Event RSVPs`

**Add these attributes to the RSVPs collection:**
```
eventId        | String    | Size: 255   | Required: Yes
name           | String    | Size: 255   | Required: Yes
email          | String    | Size: 255   | Required: Yes
ticketId       | String    | Size: 255   | Required: Yes
```

### 6. Create Storage Buckets
- Go to **Storage**
- Click **Create Bucket**

**Create first bucket:**
- Bucket ID: `event-covers`
- Name: `Event Cover Images`
- Permissions: Read access for `Any`
- File size limit: 10MB
- Allowed file extensions: `jpg,jpeg,png,gif,webp`

**Create second bucket:**
- Bucket ID: `event-logos`
- Name: `Event Logo Images`
- Permissions: Read access for `Any`
- File size limit: 5MB
- Allowed file extensions: `jpg,jpeg,png,gif,webp,svg`

### 7. Set Permissions
For both collections and buckets, make sure to set appropriate permissions:
- **Read**: Role: Member
- **Create**: Role: Member
- **Update**: Role: Member
- **Delete**: Role: Member

## ✅ Verification
After completing the setup, run:
```bash
npm run test:appwrite
```

This should show all resources as found and ready to use.

## 🚀 Next Steps
Once setup is complete, test the application:
```bash
npm run dev
```

Then visit http://localhost:9002 and try:
1. Creating an account
2. Logging in
3. Creating an event
4. Viewing the event page
