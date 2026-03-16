// API service functions for Badelha Dealer
import axiosInstance from '../service/api';
const API_BASE_URL = '/api/1.0';

/**
 * Create a new user account
 */
export async function createUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  company: string;
  companyPhone: string;
  location: string;
  licenseNumber: string;
  website?: string;
}) {
  try {
    const response = await axiosInstance.post(`/1.0/dealer/sign-up`, userData);

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
    const response = await axiosInstance.post(`/1.0/dealer/sign-in`, {
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

export async function dealerProfile() {
  try {
    const response = await axiosInstance.get(`/1.0/dealer/profile`);

    if (!response.data) {
      throw new Error('Failed to dealer profile');
    }

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Fetch all notifications
 */
export async function fetchNotifications() {
  try {
    const response = await axiosInstance.get(`/1.0/notification/find-all`);

    if (!response.data) {
      throw new Error('Failed to fetch notifications');
    }

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Upload media file
 */
export async function uploadMedia(file: File, imageableId: string, imageableType: string = 'Dealer', fileCaption: string = '') {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageableId', imageableId);
    formData.append('imageableType', imageableType);
    formData.append('fileCaption', fileCaption);

    const response = await axiosInstance.post(`/1.0/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data) {
      throw new Error('Failed to upload media');
    }

    return response.data;
  } catch (error) {
    console.error('Media Upload Error:', error);
    throw error;
  }
}

/**
 * Update dealer profile
 */
export async function updateDealerProfile(profileData: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  company?: string;
  companyPhone?: string;
  licenseNumber?: string;
  dealerType?: string;
  location?: string;
  website?: string;
  status?: string;
},dealerType: string) {
  try {
    const response = await axiosInstance.put(dealerType == 'company' ?  `/1.0/dealer/update/company-profile` : '/1.0/dealer/update/individual-dealer', profileData);

    if (!response.data) {
      throw new Error('Failed to update profile');
    }

    return response.data;
  } catch (error) {
    console.error('Profile Update Error:', error);
    throw error;
  }
}
