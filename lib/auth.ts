export interface User {
    id: string;
    email: string;
    name: string;
    dealershipName: string;
    phone: string;
    licenseNumber: string;
    avatar?: string;
    joinedDate: string;
    totalBids: number;
    wonAuctions: number;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
  }
  
  // Mock user data for demonstration
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'john@premiumautos.com',
      name: 'John Smith',
      dealershipName: 'Premium Auto Group',
      phone: '+1 (555) 123-4567',
      licenseNumber: 'DL-2024-001',
      joinedDate: '2023-01-15',
      totalBids: 156,
      wonAuctions: 23
    }
  ];
  
  class AuthService {
    private currentUser: User | null = null;
  
    async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => u.email === email);
      if (user && password === 'password') {
        this.currentUser = user;
        localStorage.setItem('auth_user', JSON.stringify(user));
        return { success: true, user };
      }
      
      return { success: false, error: 'Invalid credentials' };
    }
  
    async signup(userData: {
      email: string;
      password: string;
      name: string;
      dealershipName: string;
      phone: string;
      licenseNumber: string;
    }): Promise<{ success: boolean; user?: User; error?: string }> {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.find(u => u.email === userData.email)) {
        return { success: false, error: 'User already exists' };
      }
  
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        dealershipName: userData.dealershipName,
        phone: userData.phone,
        licenseNumber: userData.licenseNumber,
        joinedDate: new Date().toISOString().split('T')[0],
        totalBids: 0,
        wonAuctions: 0
      };
  
      mockUsers.push(newUser);
      this.currentUser = newUser;
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    }
  
    async logout(): Promise<void> {
      this.currentUser = null;
      localStorage.removeItem('auth_user');
    }
  
    getCurrentUser(): User | null {
      if (this.currentUser) return this.currentUser;
      
      const stored = localStorage.getItem('baddelha_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      }
      
      return null;
    }
  
    async updateProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!this.currentUser) {
        return { success: false, error: 'Not authenticated' };
      }
  
      const updatedUser = { ...this.currentUser, ...updates };
      this.currentUser = updatedUser;
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      // Update in mock data
      const index = mockUsers.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        mockUsers[index] = updatedUser;
      }
      
      return { success: true, user: updatedUser };
    }
  }
  
  export const authService = new AuthService();