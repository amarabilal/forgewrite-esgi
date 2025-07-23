# Admin Back Office Documentation

## Overview
A comprehensive admin back office system has been created for the ForgeWrite application to manage users, books, and system statistics.

## Features

### 1. User Management
- **View all users** with pagination and search
- **Create new users** with email, password, and role assignment
- **Edit users** including email, role, and password updates
- **Delete users** with cascade deletion of all associated data
- **View user details** including their books and activity
- **User statistics** showing total users, admin/member counts, and recent registrations

### 2. Book Management
- **View all books** from all users with search functionality
- **View book details** including chapters, characters, and metadata
- **Delete books** with all associated data (chapters, characters, comments, etc.)
- **Search books** by title, genre, or author email

### 3. Statistics Dashboard
- **User statistics**: Total users, admin/member counts, recent registrations
- **Content statistics**: Total books, chapters, characters, comments
- **Recent activity**: Latest user registrations and book creations

### 4. Security
- **Admin authentication**: Only users with `admin` role can access admin routes
- **Self-protection**: Admins cannot delete their own accounts
- **Cascade deletion**: When a user is deleted, all their data is automatically removed

## API Endpoints

### Admin User Management
```
GET    /api/admin/users       - Get all users
GET    /api/admin/users/stats - Get user statistics
GET    /api/admin/users/:id   - Get user by ID with details
POST   /api/admin/users       - Create new user
PUT    /api/admin/users/:id   - Update user
DELETE /api/admin/users/:id   - Delete user (cascade)
```

### Admin Book Management
```
GET    /api/admin/books       - Get all books
GET    /api/admin/books/:id   - Get book by ID with details
DELETE /api/admin/books/:id   - Delete book (cascade)
```

### Other Admin Routes
- `/api/admin/chapters` - Chapter management
- `/api/admin/characters` - Character management
- `/api/admin/comments` - Comment management
- `/api/admin/notes` - Note management
- `/api/admin/stats` - Statistics management
- `/api/admin/map-items` - Map item management

## Frontend Access

### Admin Dashboard
- **URL**: `/admin`
- **Access**: Only available to users with `admin` role
- **Features**: Tabbed interface with User Management, Book Management, and Statistics

### Navigation
- Admin users will see an "Admin" link in the navigation bar
- Clicking it takes them to the admin dashboard
- Non-admin users won't see this link

## Test Users

For testing purposes, you can use these accounts:

### Admin Account
- **Email**: `admin@test.com`
- **Password**: `admin123`
- **Role**: `admin`

### Regular User Account
- **Email**: `user@test.com`
- **Password**: `user123`
- **Role**: `member`

## Database Schema Updates

The database schema has been updated to include cascade deletion:
- When a user is deleted, all their books are automatically deleted
- When a book is deleted, all chapters, characters, comments, notes, stats, and map items are automatically deleted
- This ensures data integrity and prevents orphaned records

## How to Use

1. **Start the servers**:
   ```bash
   # Backend
   cd api && npm start
   
   # Frontend
   cd client && npm run dev
   ```

2. **Create test users** (if needed):
   ```bash
   cd api && node scripts/createTestUsers.js
   ```

3. **Login as admin**:
   - Go to http://localhost:5173/login
   - Use admin@test.com / admin123

4. **Access admin dashboard**:
   - Click "Admin" in the navigation
   - Use the tabbed interface to manage users, books, and view statistics

## Security Considerations

- All admin routes require authentication and admin role
- Password hashing using bcrypt
- Input validation on all endpoints
- Protection against self-deletion for admin users
- CORS configuration for security

## Future Enhancements

Potential improvements for the admin system:
- Activity logging for admin actions
- Bulk operations (bulk delete, bulk role change)
- Advanced filtering and sorting
- Export functionality for data
- Email notifications for admin actions
- Admin role hierarchy (super admin, moderator, etc.)
- Scheduled reports and analytics
