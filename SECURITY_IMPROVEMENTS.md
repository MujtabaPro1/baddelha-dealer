# Security Improvements for Authentication System

## Current Limitations

The current authentication implementation is a client-side mock designed for demonstration purposes. It has several security limitations that should be addressed before deploying to production:

1. **Client-side only authentication**: No server validation of authentication state
2. **localStorage usage**: Vulnerable to XSS attacks
3. **No token expiration**: Sessions never expire
4. **Hardcoded credentials**: Single user with fixed password
5. **No CSRF protection**: Cross-Site Request Forgery vulnerabilities
6. **No protection against brute force attacks**: No rate limiting or account lockouts

## Recommended Improvements

### 1. Implement JWT-based Authentication

```typescript
// Example JWT implementation
import jwt from 'jsonwebtoken';

// On login
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Store tokens
const accessToken = token;
const refreshToken = jwt.sign(
  { userId: user.id, tokenVersion: user.tokenVersion },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

### 2. Secure Token Storage

Replace localStorage with more secure alternatives:

```typescript
// Instead of localStorage
localStorage.setItem('auth_user', JSON.stringify(user));

// Use HttpOnly cookies (requires server-side implementation)
// Set in server response:
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600000 // 1 hour
});
```

### 3. Token Refresh Mechanism

```typescript
// Client-side token refresh
const refreshAuth = async () => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });
    
    if (response.ok) {
      // New access token received
      const { accessToken } = await response.json();
      // Update auth state
    } else {
      // Force logout if refresh fails
      logout();
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    logout();
  }
};
```

### 4. API Request Authentication

```typescript
// Update the API service to include auth headers
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); // Get from secure storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses (unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await refreshAuth();
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 5. Password Security

```typescript
// Server-side password hashing (using bcrypt)
import bcrypt from 'bcrypt';

// When storing passwords
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// When verifying passwords
const isMatch = await bcrypt.compare(password, user.hashedPassword);
```

### 6. CSRF Protection

```typescript
// Generate CSRF token
import { randomBytes } from 'crypto';

const csrfToken = randomBytes(32).toString('hex');
res.cookie('XSRF-TOKEN', csrfToken, {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});

// Client-side usage
// Add CSRF token to requests
api.interceptors.request.use(
  (config) => {
    config.headers['X-CSRF-Token'] = getCsrfToken(); // Get from cookie
    return config;
  },
  (error) => Promise.reject(error)
);
```

### 7. Rate Limiting

```typescript
// Server-side rate limiting (using express-rate-limit)
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later'
});

app.use('/api/auth/login', loginLimiter);
```

### 8. Multi-factor Authentication

```typescript
// Example two-factor authentication flow
async function loginWithTwoFactor(email, password) {
  // First verify credentials
  const { success, user } = await verifyCredentials(email, password);
  
  if (success) {
    // Generate and send OTP code
    const otpCode = generateOTP();
    await sendOTPToUser(user.email, otpCode);
    
    // Return partial auth state
    return { 
      success: true, 
      requiresTwoFactor: true,
      tempToken: generateTempToken(user.id)
    };
  }
  
  return { success: false };
}

// Verify OTP in second step
async function verifyOTP(tempToken, otpCode) {
  const userId = validateTempToken(tempToken);
  const isValidOTP = await validateOTP(userId, otpCode);
  
  if (isValidOTP) {
    // Generate full access tokens
    return {
      success: true,
      accessToken: generateAccessToken(userId),
      refreshToken: generateRefreshToken(userId)
    };
  }
  
  return { success: false };
}
```

### 9. Security Headers

```typescript
// In Next.js config
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};
```

## Implementation Priority

1. **High Priority**
   - JWT-based authentication with proper token storage
   - Password hashing (server-side)
   - Basic API request authentication

2. **Medium Priority**
   - Token refresh mechanism
   - CSRF protection
   - Security headers

3. **Low Priority**
   - Multi-factor authentication
   - Advanced rate limiting
   - Audit logging

## Recommended Libraries

- **Authentication**: NextAuth.js, Auth0, or Firebase Authentication
- **JWT**: jsonwebtoken
- **Password Hashing**: bcrypt
- **API Client**: axios with interceptors
- **Form Validation**: zod or yup
- **Rate Limiting**: express-rate-limit

By implementing these security improvements, the authentication system will be significantly more secure and ready for production use.
