# Production Admin Creation Guide

## Option 1: Script-based Creation (Recommended)

### Step 1: Set Environment Variables
```bash
# On your production server
export ADMIN_EMAIL="your-admin@company.com"
export ADMIN_PASSWORD="your-secure-password-123"
```

Or add to your `.env` file:
```env
ADMIN_EMAIL=your-admin@company.com
ADMIN_PASSWORD=your-secure-password-123
```

### Step 2: Run the Script
```bash
# In your production server
cd /path/to/your/api
npm run create-admin
```

Or directly:
```bash
node scripts/createProductionAdmin.js
```

### Step 3: Clean Up (Important!)
After creating the admin, remove the environment variables for security:
```bash
unset ADMIN_EMAIL
unset ADMIN_PASSWORD
```

## Option 2: Emergency Route (Use Only If Script Fails)

### Step 1: Enable Emergency Route
Add to your production `.env` file:
```env
ENABLE_EMERGENCY_ADMIN=true
EMERGENCY_ADMIN_KEY=your-very-secret-emergency-key-12345
```

### Step 2: Make API Request
```bash
curl -X POST https://your-domain.com/api/emergency/emergency-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "secure-password-123",
    "emergencyKey": "your-very-secret-emergency-key-12345"
  }'
```

### Step 3: Disable Emergency Route (Critical!)
Remove from `.env`:
```env
# Remove these lines after admin creation
# ENABLE_EMERGENCY_ADMIN=true
# EMERGENCY_ADMIN_KEY=your-very-secret-emergency-key-12345
```

## Option 3: Database Direct Insert (Advanced)

If you have direct database access:

```sql
-- Replace with your actual values
INSERT INTO users (email, password, role, created_at, updated_at) 
VALUES (
  'admin@company.com', 
  '$2a$12$your_bcrypt_hashed_password_here',
  'admin',
  NOW(),
  NOW()
);
```

To generate bcrypt hash:
```javascript
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('your-password', 12));
```

## Option 4: Promote Existing User

If you already have a regular user account:

```javascript
// Connect to your production database and run:
await prisma.users.update({
  where: { email: 'existing-user@company.com' },
  data: { role: 'admin' }
});
```

## Security Best Practices

1. **Use Strong Passwords**: Minimum 12 characters with mixed case, numbers, and symbols
2. **Clean Up**: Always remove admin creation credentials after use
3. **Limit Access**: Only create admin accounts when necessary
4. **Monitor**: Log admin account creation and usage
5. **Rotate**: Change admin passwords regularly

## Verification

After creating an admin, verify it works:

```bash
# Test login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "your-password"
  }'

# Test admin access (use token from login response)
curl -X GET https://your-domain.com/api/admin/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

- **"User already exists"**: Check if email is already registered
- **"Environment variables not set"**: Ensure ADMIN_EMAIL and ADMIN_PASSWORD are set
- **"Database connection error"**: Verify DATABASE_URL is correct
- **"403 Forbidden"**: Check if user has admin role and auth middleware is working
