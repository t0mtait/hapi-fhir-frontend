# HAPI FHIR Frontend

A modern Next.js frontend application for managing FHIR resources with Auth0 authentication and PostgreSQL integration.

<img width="1860" height="827" alt="image" src="https://github.com/user-attachments/assets/669286c1-99da-4d3a-88fb-4fd29f08df17" />

## 🚀 Features

- **FHIR Resource Management**: Create, view, and delete FHIR resources
- **Auth0 Authentication**: Secure user authentication and authorization
- **User Management**: View and manage application users
- **PostgreSQL Integration**: Automatic user sync to database
- **Dashboard**: Centralized view of resources and user data
- **Responsive UI**: Built with Flowbite React and Tailwind CSS

## 📋 Tech Stack

- **Framework**: Next.js 15.4.2 (App Router)
- **Language**: TypeScript 5.8.3
- **UI Library**: React 19.1.0
- **Authentication**: Auth0
- **Database**: PostgreSQL (via `pg` library)
- **Styling**: Tailwind CSS 4.1.11 + Flowbite React
- **Code Quality**: ESLint, Prettier

## 🛠️ Prerequisites

- Node.js 18+ 
- PostgreSQL database (see [hapi-fhir-server](https://github.com/t0mtait/hapi-fhir-server) for containerized setup)
- Auth0 account and application
- HAPI FHIR server running

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/t0mtait/hapi-fhir-frontend.git
   cd hapi-fhir-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # Auth0 Configuration
   NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
   NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id

   # PostgreSQL Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your-database-name
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password

   # FHIR Server Configuration
   FHIR_BASE_URL=http://localhost:8080/fhir
   ```

4. **Initialize the database**
   ```bash
   psql -h localhost -p 5432 -U your-user -d your-database -f database/migration.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
hapi-fhir-frontend/
├── app/
│   ├── api/
│   │   ├── createresource/      # Create FHIR resources
│   │   ├── deleteresource/      # Delete FHIR resources
│   │   ├── resources/           # Fetch FHIR resources
│   │   └── users/
│   │       ├── route.ts         # User CRUD operations
│   │       └── sync/            # Auth0 user sync
│   ├── createresource/          # Resource creation UI
│   ├── dashboard/               # Dashboard page
│   ├── resources/               # Resources list page
│   ├── users/                   # Users management page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── Auth0ProviderWrapper.tsx # Auth0 provider setup
│   ├── UserSyncProvider.tsx     # Auto user sync
│   └── useUserSync.ts           # User sync hook
├── lib/
│   └── db.ts                    # PostgreSQL connection pool
└── database/
    └── migration.sql            # Database schema
```

## 🔑 Key Features Explained

### Auth0 + PostgreSQL Integration

The application automatically syncs authenticated users to PostgreSQL:

1. **User logs in via Auth0** → Auth0 handles authentication
2. **UserSyncProvider detects login** → Triggers sync hook
3. **POST to `/api/users/sync`** → Sends user data
4. **Database update** → User created/updated in `app_user` table

**Key Components:**
- `Auth0ProviderWrapper` - Auth0 configuration
- `UserSyncProvider` - Auto-sync wrapper
- `useUserSync` hook - Sync logic
- `/api/users/sync` - Sync endpoint

### FHIR Resource Management

Connect to your HAPI FHIR server to:
- **Create resources** - POST FHIR-compliant JSON
- **View resources** - Browse all stored resources
- **Delete resources** - Remove resources by ID

Resources are fetched directly from your FHIR server and displayed in a searchable table

## 📊 Database Schema

The `app_user` table stores synchronized Auth0 users:
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

Run the migration script to create this table:
```bash
psql -h localhost -p 5432 -U your-user -d your-database -f database/migration.sql
```

## 🔌 API Endpoints

### User Management

#### `POST /api/users/sync`
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

#### `GET /api/users`
Retrieves all users from the database.

**Response:**
```json
{
  "success": true,
  "users": [...],
  "count": 5
}
```

#### `POST /api/users`
Creates a new user manually.

### FHIR Resource Management

#### `GET /api/resources`
Fetches all resources from FHIR server.

#### `POST /api/createresource`
Creates a new FHIR resource.

**Request Body:** Valid FHIR resource JSON
```json
{
  "resourceType": "Patient",
  "name": [{"given": ["John"], "family": "Doe"}],
  "birthDate": "1990-01-01"
}
```

#### `DELETE /api/deleteresource`
Deletes a FHIR resource by ID.

**Query Parameters:** `?resourceType=Patient&id=123`

## 🧪 Testing

### Test User Sync
1. Start the dev server: `npm run dev`
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. Click "Login" and authenticate via Auth0
4. Check browser console for sync messages
5. Verify in database:
   ```sql
   SELECT id, username, email, created_at 
   FROM app_user 
   ORDER BY created_at DESC;
   ```

### Test FHIR Integration
1. Ensure your FHIR server is running
2. Navigate to "Create Resource" page
3. Enter valid FHIR JSON
4. Submit and verify in "Resources" page

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
