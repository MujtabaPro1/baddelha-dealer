# Authentication Test Plan

## Test Cases

### 1. Initial Access Redirection
- **Objective**: Verify that unauthenticated users are redirected to the login page
- **Steps**:
  1. Clear local storage to remove any existing auth tokens
  2. Navigate to the main page (`/`)
  3. Verify redirection to the auth page (`/auth`)
- **Expected Result**: User should be automatically redirected to `/auth`

### 2. Login Functionality
- **Objective**: Verify that users can log in with valid credentials
- **Steps**:
  1. Navigate to the auth page (`/auth`)
  2. Enter valid credentials (email: `john@example.com`, password: `password`)
  3. Click the login button
- **Expected Result**: User should be authenticated and redirected to the main page

### 3. Authentication Persistence
- **Objective**: Verify that authentication state persists across page refreshes
- **Steps**:
  1. Log in successfully
  2. Refresh the page
- **Expected Result**: User should remain logged in and not be redirected to the auth page

### 4. Logout Functionality
- **Objective**: Verify that users can log out
- **Steps**:
  1. Log in successfully
  2. Click on the user avatar in the header
  3. Click the "Log out" option in the dropdown menu
- **Expected Result**: User should be logged out and redirected to the auth page

### 5. Protected Route Access
- **Objective**: Verify that authenticated users can access protected routes
- **Steps**:
  1. Log in successfully
  2. Navigate to the main page (`/`)
- **Expected Result**: User should be able to view the car auction platform

### 6. Login Form Validation
- **Objective**: Verify that the login form validates inputs correctly
- **Steps**:
  1. Navigate to the auth page (`/auth`)
  2. Submit the form with empty fields
  3. Submit the form with invalid email format
  4. Submit the form with incorrect credentials
- **Expected Result**: Appropriate error messages should be displayed

### 7. Signup Form Validation
- **Objective**: Verify that the signup form validates inputs correctly
- **Steps**:
  1. Navigate to the auth page (`/auth`)
  2. Switch to the signup form
  3. Submit the form with empty fields
  4. Submit the form with mismatched passwords
  5. Submit the form with invalid email format
- **Expected Result**: Appropriate error messages should be displayed

### 8. User Profile Display
- **Objective**: Verify that the user's information is displayed correctly in the header
- **Steps**:
  1. Log in successfully
  2. Observe the user avatar and name in the header
  3. Click on the avatar to open the dropdown menu
- **Expected Result**: User's name, email, and avatar should be displayed correctly

## Test Environment
- **Browser**: Chrome, Firefox, Safari
- **Device**: Desktop, Mobile
- **Mock User**: 
  - Email: john@example.com
  - Password: password
  - Name: John Doe

## Notes
- This test plan focuses on frontend authentication flow
- Authentication is currently mocked with a single demo user
- Future improvements should include real backend authentication integration
