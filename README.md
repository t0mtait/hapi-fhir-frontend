## HAPI Fhir Frontend

<img width="1860" height="827" alt="image" src="https://github.com/user-attachments/assets/669286c1-99da-4d3a-88fb-4fd29f08df17" />

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Auth0 + PostgreSQL User Registration Setup

This document explains how to set up automatic user registration in PostgreSQL when users sign up via Auth0.

## Overview

When a user registers or logs in through Auth0, the system automatically:
1. Captures the Auth0 user data
2. Syncs the user to the containerized PostgreSQL database running on port 5432. Please see /hapi-fhir-server for that code
3. Creates or updates user records in the `app_user` table

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Auth0 Configuration
```bash
# Auth0 Settings (get these from your Auth0 Dashboard)
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id

# Optional: Auth0 Management API (for advanced features)
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_MANAGEMENT_CLIENT_ID=your-management-client-id
AUTH0_MANAGEMENT_CLIENT_SECRET=your-management-client-secret
```

### PostgreSQL Configuration
```bash
# Database Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password
```

## Database Setup

1. **Run the migration script** to create the required table structure:
   ```bash
   psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/migration.sql
   ```

2. **Verify the table structure**:
   ```sql
   SELECT * FROM app_user LIMIT 1;
   ```

## How It Works

### 1. User Registration Flow
```
User registers/logs in via Auth0
         ↓
Auth0ProviderWrapper detects authentication
         ↓
useUserSync hook triggers
         ↓
Calls /api/users/sync endpoint
         ↓
User data saved to PostgreSQL
```

### 2. Key Components

- **`Auth0ProviderWrapper`**: Main Auth0 provider with automatic user sync
- **`UserSyncProvider`**: Wrapper component that triggers user synchronization
- **`useUserSync`**: React hook that handles the sync logic
- **`/api/users/sync`**: API endpoint for user synchronization

### 3. Database Schema
```sql
CREATE TABLE app_user ( 
    id SERIAL PRIMARY KEY, 
    username varchar, 
    email varchar UNIQUE NOT NULL, 
    auth0_user_id varchar UNIQUE NOT NULL, 
    roles json, 
    profile_info json, 
    created_at timestamp with time zone DEFAULT current_timestamp, 
    updated_at timestamp with time zone DEFAULT current_timestamp
);
```

## API Endpoints

### POST /api/users/sync
Synchronizes Auth0 user data with PostgreSQL.

**Request Body:**
```json
{
  "auth0_id": "auth0|123456789",
  "email": "user@example.com",
  "username": "johndoe",
  "name": "John Doe",
  "picture": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "user": { 
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com",
    // ... other user fields
  },
  "message": "User created successfully",
  "isNewUser": true
}
```

### GET /api/users
Retrieves all users from the database.

## Testing the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test user registration:**
   - Navigate to your app
   - Click login/register
   - Complete Auth0 registration
   - Check browser console for sync messages
   - Verify user appears in database

3. **Check database:**
   ```sql
   SELECT id, username, email, auth0_user_id, created_at 
   FROM app_user 
   ORDER BY created_at DESC;
   ```

## Troubleshooting

### Common Issues

1. **"Auth0 Configuration Missing" Error**
   - Ensure `.env.local` has correct Auth0 variables
   - Restart development server after adding variables

2. **Database Connection Errors**
   - Verify PostgreSQL is running
   - Check database credentials in `.env.local`
   - Test connection with: `npm run test-db` (if available)

3. **User Sync Failures**
   - Check browser console for error messages
   - Verify `/api/users/sync` endpoint is accessible
   - Check database table exists and has correct structure

### Debugging

Enable debug logging by adding to your environment:
```bash
DEBUG=true
NODE_ENV=development
```

This will show detailed logs for:
- Auth0 authentication events
- Database queries
- User sync operations

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Database Access**: Use connection pooling and proper user permissions
3. **API Security**: Consider adding rate limiting to sync endpoint
4. **Data Validation**: The system validates required fields before database insertion

## Next Steps

After setting up basic user registration, you might want to:

1. **Add role-based authorization**
2. **Implement user profile management**
3. **Set up user preferences/settings**
4. **Add audit logging for user actions**
5. **Implement user deletion/deactivation**

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
