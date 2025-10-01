// API service functions for Badelha Dealer
import axiosInstance from '../service/api';
const API_BASE_URL = '/api/1.0';

/**
 * Create a new user account
 */
export async function createUser(userData: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  userType?: number; // Default to dealer (4)
  status?: string; // Default to Active
}) {
  try {
    const response = await axiosInstance.post(`/1.0/user/create`, {
        ...userData,
        userType: userData.userType || 4, // Default to dealer type
        status: userData.status || 'Active',
      });

    if (!response.data) {
      throw new Error(response.data.message || 'Failed to create account');
    }

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string) {
  try {
    const response = await axiosInstance.post(`/1.0/auth/login`, {
      email,
      password,
    });

    if (!response.data) {
      throw new Error(response.data.message || 'Login failed');
    }

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
