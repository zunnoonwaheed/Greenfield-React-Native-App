# Test Credentials

## Available Test Accounts

### 1. Your Account (Just Reset) ✅
- **Email:** `zunnoonwaheed@gmail.com`
- **Password:** `Password123!`
- **Name:** Zunnoon

### 2. Test User (Created for Testing)
- **Email:** `test@example.com`
- **Password:** `Passw0rd!`
- **Name:** Test User

### 3. Admin Account
- **Email:** `admin@greenfield.com`
- **Password:** `admin123` (default from seed)
- **Name:** Admin User

### 4. Customer Account
- **Email:** `customer@test.com`
- **Password:** `test123` (default from seed)
- **Name:** Test Customer

---

## How to Login

### Mobile App
1. Open the app
2. Navigate to Login screen
3. Enter one of the above email/password combinations
4. Tap Login

**Expected behavior:**
- ✅ Single request to server
- ✅ Success message
- ✅ Navigation to HomescreenNew

---

## Resetting a User's Password

If you forget a password, run:

```bash
cd greenfield-backend
node reset-user-password.js
```

Then edit the file to change:
- `const email = 'your-email@example.com';`
- `const newPassword = 'YourNewPassword123!';`

---

## Creating New Test Users

Run the seed script:
```bash
cd greenfield-backend
node seed.js
```

This will create the default admin and customer accounts.

---

## Troubleshooting

### "Invalid email or password"
**Causes:**
1. Wrong email (check spelling, including typos like "tesr" instead of "test")
2. Wrong password
3. User doesn't exist

**Fix:**
1. Double-check email spelling
2. Try one of the accounts above
3. Reset password using `reset-user-password.js`

### "User not found"
The email doesn't exist in the database.

**Fix:** Use one of the accounts listed above.

---

## Current Database Status

Run this to see all users:
```bash
cd greenfield-backend
node check-users.js
```

This will show:
- All user emails
- Whether they have proper bcrypt hashes
- User IDs and names
