# User Seed Script - Quick Reference

## Overview

This script populates the database with a configurable number of user accounts for testing and development.

### Features

- **Dynamic user count** - Specify how many users to create (default: 58)
- **Automatic role assignment**:
  - 1 Admin account
  - 2 Moderator accounts
  - Remaining accounts as regular users
- **Unique email addresses** - All generated emails are unique
- **Configurable password** - Set via environment variable or use default

## Usage

### Basic Usage (Default: 58 users)

```bash
cd apps/backend
pnpm seed:users
```

### Specify User Count via Command Line

```bash
# Create 10 users
pnpm seed:users 10

# Create 100 users
pnpm seed:users 100

# Create 500 users
pnpm seed:users 500
```

### Specify User Count via Environment Variable

```bash
# Create 25 users
SEED_USER_COUNT=25 pnpm seed:users

# With custom password
SEED_USER_COUNT=50 SEED_PASSWORD="MySecret123!" pnpm seed:users
```

### Minimum Requirement

The script requires at least **3 users** (1 admin + 2 moderators).

### Custom Password

```bash
# Set custom password for all accounts
SEED_PASSWORD="MyCustomPass123!" pnpm seed:users 20
```

Default password: **`Password123!`**

### Reset and Re-seed

```bash
# Clear all data and recreate schema
pnpm db:reset

# Seed users
pnpm seed:users
```

### View Users in Database

```bash
# Total count by role
docker exec -i level2gym-postgres psql -U postgres -d level2gym -c \
  "SELECT role, COUNT(*) FROM users GROUP BY role;"

# List all users
docker exec -i level2gym-postgres psql -U postgres -d level2gym -c \
  "SELECT name, email, role FROM users ORDER BY role, email;"
```

## Sample Test Accounts

### Admin Account

- Email: `james.smith@gmail.com`
- Password: `Password123!`
- Role: admin

### Moderator Accounts

- Email: `mary.smith@yahoo.com` | Password: `Password123!` | Role: moderator
- Email: `john.smith@outlook.com` | Password: `Password123!` | Role: moderator

### Sample User Accounts

All use password `Password123!`:

- `patricia.smith@hotmail.com`
- `robert.smith@icloud.com`
- `jennifer.smith@protonmail.com`
- `michael.smith@mail.com`
- `linda.smith@aol.com`
- ... and 50 more unique accounts

## Email Patterns

Emails follow the pattern: `firstname.lastname[number]@domain.com`

Domains used:

- gmail.com
- yahoo.com
- outlook.com
- hotmail.com
- icloud.com
- protonmail.com
- mail.com
- aol.com
- zoho.com
- fastmail.com

## Verification

All 58 accounts have:

- ✅ Unique email addresses
- ✅ Valid bcrypt hashed passwords (60 characters)
- ✅ Proper role assignment (admin/moderator/user)
- ✅ Full names (First Last)
- ✅ Created timestamps

## Testing API Endpoints

With these accounts, you can test:

- User login with various roles
- Pagination (58 users across multiple pages)
- Role-based access control
- User listing and filtering
- Authentication flows

Example API call:

```bash
# Login as admin
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"james.smith@gmail.com","password":"Password123!"}'

# Get all users
curl http://localhost:3001/users
```

# Database Seed Scripts

This directory contains scripts for populating the database with test data.

## User Seed Script

The `seed-users.ts` script populates the users table with 58 different accounts for testing purposes.

### Usage

From the backend directory:

```bash
cd apps/backend
pnpm seed:users
```

### What it creates

- **1 Admin account** - Full system access
- **2 Moderator accounts** - Moderation privileges
- **55 Regular user accounts** - Standard user access

### Credentials

All accounts use the same password for easy testing:

- **Password**: `Password123!`
- **Emails**: Generated automatically with unique email addresses

Example emails:

- Admin: `james.smith@gmail.com`
- Moderator 1: `mary.smith@yahoo.com`
- Moderator 2: `john.smith@outlook.com`
- Users: Various combinations of names and domains

### Email Generation

Emails are generated using:

- Diverse first and last names from common name lists
- Multiple email domains (gmail.com, yahoo.com, outlook.com, etc.)
- Numeric suffixes when needed to ensure uniqueness
- Pattern: `firstname.lastname[number]@domain.com`

### Database Requirements

The script requires:

- PostgreSQL database running (via Docker or otherwise)
- Database connection configured in `.env`
- Users table created (run migrations first if needed)

### Resetting Data

To clear all users and re-seed:

```bash
# Clear all tables and recreate schema
pnpm db:reset

# Then re-seed users
pnpm seed:users
```

### Script Output

The script provides detailed logging:

- Password hashing progress
- Special account creation (admin/moderators)
- Total counts by role
- Success/error messages

Example output:

```
🌱 Starting user seed script...
📊 Creating 58 user accounts
🔐 All accounts use password: Password123!

⏳ Hashing password...
✅ Password hashed

👥 Generating user data...
   👑 Admin: james.smith@gmail.com
   🛡️  Moderator: mary.smith@yahoo.com
   🛡️  Moderator: john.smith@outlook.com
   👤 Regular users: 55

💾 Inserting users into database...

✅ Successfully created 58 users!

📋 Summary:
   Total users: 58
   Admins: 1
   Moderators: 2
   Users: 55

🔑 Login credentials:
   Email: Any of the generated emails
   Password: Password123!

🔌 Database connection closed
```

### Error Handling

The script will:

- Display detailed error messages if insertion fails
- Exit with error code 1 on failure
- Properly close database connections
- Show full stack traces for debugging

Common issues:

- **Duplicate emails**: The script uses unique combinations, but if you run it twice without clearing, it will fail
- **Database connection**: Ensure DATABASE_URL is configured correctly
- **Missing table**: Run `pnpm db:push` to create tables first
