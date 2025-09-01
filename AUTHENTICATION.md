# Authentication Implementation

## Overview

The authentication system for Badelha Dealer implements a client-side authentication flow using React Context API and localStorage for state persistence. This document outlines the implementation details, components, and flow of the authentication system.

## Components

### 1. AuthContext (`contexts/AuthContext.tsx`)

The central piece of the authentication system that:
- Manages global authentication state
- Provides authentication methods (login, signup, logout)
- Persists user state in localStorage
- Exposes authentication status to components

```tsx
// Key features
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  updateProfile: async () => ({ success: false }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Authentication methods
  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  // Other methods: signup, logout, updateProfile
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      signup, 
      logout,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Auth Service (`lib/auth.ts`)

Handles the actual authentication logic:
- Mock implementation of authentication API calls
- User data storage and retrieval
- Token management (simulated)

```tsx
// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '',
    role: 'dealer'
  }
];

// Authentication methods
async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulates API call with timeout
  await new Promise(resolve => setTimeout(resolve, 1000));
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password') {
    this.currentUser = user;
    localStorage.setItem('auth_user', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: 'Invalid credentials' };
}
```

### 3. Auth Page (`app/auth/page.tsx`)

Provides the login/signup UI:
- Toggles between login and signup forms
- Handles form submission
- Manages authentication errors
- Redirects authenticated users

```tsx
// Key features
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Form submission handlers
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      router.push('/');
    }
  };

  // UI rendering
  return (
    <div>
      {isLogin ? (
        <LoginForm 
          onLogin={handleLogin} 
          onSwitchToSignup={() => setIsLogin(false)} 
        />
      ) : (
        <SignupForm 
          onSignup={handleSignup} 
          onSwitchToLogin={() => setIsLogin(true)} 
        />
      )}
    </div>
  );
}
```

### 4. Protected Routes (`app/page.tsx`)

Protects routes from unauthorized access:
- Checks authentication status
- Redirects unauthenticated users
- Shows loading state during authentication check

```tsx
export default function CarAuctionPlatform() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // Authentication check and redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, authLoading, router]);
  
  // Loading state
  if (authLoading) {
    return <LoadingSpinner />;
  }
  
  // Protected content
  return <MainContent />;
}
```

### 5. User Profile Menu (`components/ui/UserProfileMenu.tsx`)

Displays user information and logout option:
- Shows user avatar and name
- Provides dropdown with user details
- Handles logout functionality

```tsx
export function UserProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Authentication Flow

1. **Application Initialization**:
   - `AuthProvider` wraps the application in `app/layout.tsx`
   - On load, it checks localStorage for existing user data
   - Sets initial authentication state

2. **Unauthenticated Access**:
   - When a user tries to access a protected route (`/`)
   - `isAuthenticated` is false
   - User is redirected to `/auth`

3. **Login Process**:
   - User enters credentials on the login form
   - `login()` method from AuthContext is called
   - AuthService validates credentials
   - On success, user data is stored in state and localStorage
   - User is redirected to the protected route

4. **Authenticated Access**:
   - When a user with valid authentication visits the site
   - `isAuthenticated` is true
   - Protected content is displayed
   - User profile menu shows in the header

5. **Logout Process**:
   - User clicks logout in the profile menu
   - `logout()` method from AuthContext is called
   - User data is removed from state and localStorage
   - User is redirected to the auth page

## Security Considerations

The current implementation is a client-side mock for demonstration purposes and has several security limitations:

- Authentication state is stored in localStorage, which is vulnerable to XSS attacks
- No token expiration or refresh mechanism
- No server-side validation of authentication state
- Single hardcoded user with a fixed password

For production use, this should be enhanced with proper JWT authentication, secure cookie storage, and server-side validation.
