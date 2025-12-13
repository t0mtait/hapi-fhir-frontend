# HAPI FHIR Frontend

A modern Next.js frontend application for managing FHIR resources with Auth0 authentication and PostgreSQL integration.


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

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Auth0 Configuration Missing"** | Verify `.env.local` has `NEXT_PUBLIC_AUTH0_DOMAIN` and `NEXT_PUBLIC_AUTH0_CLIENT_ID`. Restart dev server. |
| **Database Connection Errors** | Check PostgreSQL is running on port 5432. Verify credentials in `.env.local`. Test with: `psql -h localhost -U your-user -d your-database` |
| **User Sync Failures** | Check browser console for errors. Verify `/api/users/sync` is accessible. Ensure `app_user` table exists. |
| **FHIR 400 Bad Request** | Validate FHIR JSON at [hl7.org/fhir](https://www.hl7.org/fhir/validation.html). Check `FHIR_BASE_URL` is correct. Review server logs for details. |
| **JSON Column Errors** | Ensure roles/profile_info are stored as JSON strings: `JSON.stringify(['user'])` |

### Enable Debug Logging
```bash
DEBUG=true
NODE_ENV=development
```

## 🔒 Security

- ✅ **Environment variables**: Never commit `.env.local`
- ✅ **Database pooling**: Connection pool limits set to 20
- ✅ **Parameterized queries**: SQL injection protection via `$1`, `$2` syntax
- ✅ **Auth0 authentication**: Secure OAuth 2.0 flow
- ⚠️ **TODO**: Add rate limiting to API routes
- ⚠️ **TODO**: Implement role-based access control

## 📚 Additional Resources

- [HAPI FHIR Server Setup](https://github.com/t0mtait/hapi-fhir-server) - Backend PostgreSQL + FHIR server
- [Auth0 Setup Guide](./AUTH0_SETUP.md) - Detailed Auth0 configuration
- [FHIR R4 Specification](https://www.hl7.org/fhir/) - FHIR resource documentation
- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Flowbite React](https://flowbite-react.com/) - UI component library

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of an academic assignment for healthcare informatics.

## 👤 Author

**Tom Tait**
- GitHub: [@t0mtait](https://github.com/t0mtait)
- Repository: [hapi-fhir-frontend](https://github.com/t0mtait/hapi-fhir-frontend)

---

**Note**: This application requires a running HAPI FHIR server. See the [hapi-fhir-server](https://github.com/t0mtait/hapi-fhir-server) repository for setup instructions.
