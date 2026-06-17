# APK Testing Checklist

## Pre-Testing Setup

### 1. Verify Backend Google Sign-In Configuration

Upload `test-google-endpoint.php` to cPanel and access:
```
https://greenfieldsupermarket.com/mobile-api/backend/test-google-endpoint.php
```

**Expected Results:**
- ✅ All required files exist
- ✅ Database has `google_id` and `email_verified` columns
- ✅ Google Web Client ID is configured

### 2. Configure Google Cloud Console for Production APK

**After your APK build completes:**

#### Get SHA-1 Certificate:
```bash
cd frontend
eas credentials
# Select: Android > preview > Keystore > Show Keystore
# Copy the SHA-1 fingerprint
```

#### Add to Google Cloud Console:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project
3. Click on your **Android OAuth Client** (or create new one)
4. Add:
   - **Package name**: `com.greenfieldsupermarket.app`
   - **SHA-1 certificate fingerprint**: (paste from above)
5. Save

**Alternatively**, add SHA-1 to existing Web Client:
1. Find "Greenfield Web Client" (Client ID: 969529169540-vkaojfsqj9n4167e0a2cbahlh5ogkn8v.apps.googleusercontent.com)
2. Click Edit
3. Under "Authorized redirect URIs", ensure production URLs are added

---

## APK Installation

### Download APK
When build completes, you'll get a link like:
```
https://expo.dev/accounts/YOUR_USERNAME/projects/greenfield-supermarket/builds/BUILD_ID
```

Download the APK to your Android device.

### Install APK
1. On Android device, go to Settings > Security
2. Enable "Install from Unknown Sources" or "Install Unknown Apps"
3. Use file manager to find downloaded APK
4. Tap to install
5. Grant any required permissions

---

## Testing Scenarios

### Test 1: App Launch and Permissions

**Steps:**
1. Launch the app
2. Accept location permissions when prompted
3. Allow any other permissions requested

**Expected:**
- ✅ App launches without crashes
- ✅ Splash screen displays correctly
- ✅ Location permission screen appears
- ✅ Navigation to welcome/login screen works

---

### Test 2: User Registration

**Steps:**
1. Go to Sign Up screen
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Phone: 03001234567
   - Password: Test123!
3. Submit registration

**Expected:**
- ✅ Form validation works (required fields, email format)
- ✅ API request sent to: `https://greenfieldsupermarket.com/mobile-api/backend/api/register.php`
- ✅ Success message displayed
- ✅ Redirected to verification or login screen

**Test Edge Cases:**
- Duplicate email registration (should show error)
- Weak password (test validation)
- Invalid email format

---

### Test 3: Email Verification (if implemented)

**Steps:**
1. Check email for verification link
2. Click verification link
3. Return to app

**Expected:**
- ✅ Verification email received
- ✅ Link works and verifies account
- ✅ Can now log in

---

### Test 4: Regular Login

**Steps:**
1. Go to Login screen
2. Enter registered credentials:
   - Email: test@example.com
   - Password: Test123!
3. Tap "Login"

**Expected:**
- ✅ Login successful
- ✅ JWT token stored
- ✅ Navigated to home/main screen
- ✅ User session persists on app restart

**Test Edge Cases:**
- Wrong password (should show error)
- Non-existent email (should show error)
- Empty fields (should show validation)

---

### Test 5: Google Sign-In (PRIMARY TEST)

**Steps:**
1. Go to Login screen
2. Tap "Sign in with Google" button
3. Select Google account
4. Grant permissions
5. Wait for authentication

**Expected:**
- ✅ Google sign-in dialog appears
- ✅ Can select Google account
- ✅ Account selected successfully
- ✅ API request to: `https://greenfieldsupermarket.com/mobile-api/backend/api/google-login.php`
- ✅ User logged in successfully
- ✅ Navigated to home screen
- ✅ User profile shows Google account info

**Possible Errors:**
- **DEVELOPER_ERROR**: SHA-1 not configured in Google Cloud Console
- **API_NOT_CONNECTED**: Google Sign-In API not enabled
- **SIGN_IN_CANCELLED**: User cancelled (expected behavior)
- **Network error**: Check backend logs

**Debug Steps if Google Sign-In Fails:**
1. Check: `https://greenfieldsupermarket.com/mobile-api/backend/test-google-endpoint.php`
2. Verify SHA-1 added to Google Cloud Console
3. Check package name matches: `com.greenfieldsupermarket.app`
4. Check backend error logs in cPanel

---

### Test 6: Forgot Password

**Steps:**
1. On Login screen, tap "Forgot Password"
2. Enter email: test@example.com
3. Submit
4. Check email for reset link
5. Click reset link or enter reset code
6. Enter new password
7. Submit

**Expected:**
- ✅ Password reset email sent
- ✅ Reset link/code works
- ✅ New password saved
- ✅ Can log in with new password

---

### Test 7: Products Browsing

**Steps:**
1. After login, go to products/home screen
2. Scroll through product list
3. Test search functionality
4. Apply filters (category, brand, price)
5. Tap on a product to view details

**Expected:**
- ✅ Products load from: `https://greenfieldsupermarket.com/mobile-api/backend/api/products.php`
- ✅ Total 2486 products available
- ✅ Product images display correctly
- ✅ Prices show properly
- ✅ Discounts calculated correctly
- ✅ Search works
- ✅ Filters work
- ✅ Product details page loads

**Test Performance:**
- Scroll smoothly through list
- Images load without delay
- No crashes with large dataset

---

### Test 8: Categories

**Steps:**
1. Navigate to Categories screen
2. Browse categories
3. Select a category
4. View products in category

**Expected:**
- ✅ Categories load from API
- ✅ Category images display
- ✅ Tapping category shows filtered products
- ✅ Category name displayed correctly

---

### Test 9: Shopping Cart

**Steps:**
1. Add product to cart
2. Adjust quantity (increase/decrease)
3. Remove item from cart
4. Add multiple products
5. View cart total

**Expected:**
- ✅ Products added to cart
- ✅ Quantity updates correctly
- ✅ Cart total calculated properly
- ✅ Remove item works
- ✅ Cart persists on app restart
- ✅ Cart icon shows item count

---

### Test 10: Delivery Address

**Steps:**
1. Go to address/location screen
2. Add new delivery address:
   - Label: Home
   - Area: DHA Phase 2
   - Street address: Block A, Street 5
   - Phone: 03001234567
3. Set as default address
4. Add another address
5. Edit existing address
6. Delete address

**Expected:**
- ✅ Add address form works
- ✅ Location selection works (DHA phases/areas)
- ✅ Address saved to database
- ✅ Can set default address
- ✅ Edit address works
- ✅ Delete address works
- ✅ Addresses persist

---

### Test 11: Checkout Process

**Steps:**
1. Add products to cart
2. Go to checkout
3. Select delivery address
4. Choose payment method
5. Review order
6. Place order

**Expected:**
- ✅ Checkout screen loads
- ✅ Selected address displayed
- ✅ Order total correct (including delivery charges)
- ✅ Payment method selection works
- ✅ Order placed successfully
- ✅ Order confirmation shown
- ✅ Order saved in database

---

### Test 12: Order History

**Steps:**
1. Go to Orders/Profile screen
2. View order history
3. Tap on an order to view details
4. Check order status

**Expected:**
- ✅ Orders list displayed
- ✅ Order details show correctly
- ✅ Order status visible
- ✅ Order items listed with prices

---

### Test 13: User Profile

**Steps:**
1. Go to Profile screen
2. View profile information
3. Edit profile:
   - Name
   - Phone number
   - Email (if editable)
4. Save changes

**Expected:**
- ✅ Profile data loads
- ✅ Edit form pre-filled
- ✅ Changes saved to database
- ✅ Success message shown

---

### Test 14: Change Password (Logged In)

**Steps:**
1. Go to Profile > Change Password
2. Enter:
   - Current password
   - New password
   - Confirm new password
3. Submit

**Expected:**
- ✅ Current password validated
- ✅ New password saved
- ✅ Can log in with new password
- ✅ Session remains active

---

### Test 15: Logout

**Steps:**
1. Go to Profile
2. Tap "Logout"
3. Confirm logout

**Expected:**
- ✅ Logged out successfully
- ✅ JWT token cleared
- ✅ User data cleared
- ✅ Redirected to login screen
- ✅ Cannot access protected screens without login

---

### Test 16: Chatbot/AI Assistant (if implemented)

**Steps:**
1. Open chatbot interface
2. Ask questions about products
3. Test product recommendations
4. Ask about delivery/orders

**Expected:**
- ✅ Chatbot interface opens
- ✅ Responses generated
- ✅ Product suggestions work
- ✅ Helpful information provided

---

### Test 17: Offline Behavior

**Steps:**
1. Turn off internet connection
2. Try to browse products
3. Try to login
4. Turn internet back on

**Expected:**
- ✅ App shows appropriate error messages
- ✅ Cached data still visible (if caching implemented)
- ✅ App doesn't crash
- ✅ Reconnects successfully when internet restored

---

### Test 18: Push Notifications (if implemented)

**Steps:**
1. Grant notification permissions
2. Place an order
3. Check for order status notifications

**Expected:**
- ✅ Notifications permission granted
- ✅ Notifications received for order updates
- ✅ Tapping notification opens relevant screen

---

### Test 19: Session Persistence

**Steps:**
1. Log in to app
2. Close app completely (swipe away from recent apps)
3. Reopen app after 5 minutes
4. Reopen app after 1 hour
5. Reopen app after 1 day

**Expected:**
- ✅ User remains logged in
- ✅ No need to re-authenticate
- ✅ Cart contents preserved
- ✅ Session valid for 7 days (or configured duration)

---

### Test 20: Image Loading

**Steps:**
1. Browse products with images
2. Check product detail pages
3. Check category images
4. Check bundle images

**Expected:**
- ✅ Images load from: `https://greenfieldsupermarket.com/admin/upload/dow/`
- ✅ No broken image icons
- ✅ Images display in correct aspect ratio
- ✅ Placeholder shown while loading

---

## Performance Testing

### Memory Usage
- Monitor app memory usage during extended use
- Check for memory leaks
- Ensure smooth performance with large product lists

### Battery Usage
- Check battery drain during normal use
- Ensure no background processes draining battery

### Network Usage
- Monitor data consumption
- Check for unnecessary API calls
- Verify images cached properly

---

## Bug Reporting Template

If you find bugs, report them with:

**Bug Title**: Brief description

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Screenshots**: (if applicable)

**Device Info**:
- Device: (e.g., Samsung Galaxy S21)
- Android Version: (e.g., Android 12)
- App Version: (from About screen)

**Backend Logs**: Check cPanel error_log for API errors

---

## Success Criteria

The app is ready for production if:

- ✅ All authentication methods work (login, Google, registration, password reset)
- ✅ Products load and display correctly
- ✅ Shopping cart functions properly
- ✅ Checkout process completes successfully
- ✅ Orders are saved and viewable
- ✅ No crashes or major bugs
- ✅ Performance is acceptable
- ✅ Backend API responds correctly to all requests
- ✅ Session management works properly

---

## Next Steps After Testing

1. **Fix Critical Bugs**: Address any blocking issues
2. **Optimize Performance**: Improve load times, image optimization
3. **Update Google Play Store**: Upload production build
4. **Configure Google OAuth Consent Screen**: For production approval
5. **Setup Analytics**: Track user behavior and errors
6. **Enable Crash Reporting**: Setup Sentry or Firebase Crashlytics

---

## Support Resources

**Backend API Base URL**: `https://greenfieldsupermarket.com/mobile-api/backend`

**Key Endpoints**:
- Products: `/api/products.php`
- Login: `/api/login.php`
- Register: `/api/register.php`
- Google Login: `/api/google-login.php`
- Forgot Password: `/api/forgot-password.php`

**Google Web Client ID**: `969529169540-vkaojfsqj9n4167e0a2cbahlh5ogkn8v.apps.googleusercontent.com`

**Diagnostic Tools**:
- Database Test: `https://greenfieldsupermarket.com/mobile-api/backend/test-db-connection.php`
- Google Endpoint Test: `https://greenfieldsupermarket.com/mobile-api/backend/test-google-endpoint.php`
- Products API Test: `https://greenfieldsupermarket.com/mobile-api/backend/test-products-api.php`
