/**
 * User Service - Handles API calls related to user management
 */

// Type definitions for user data based on actual API response format
export type User = {
  id?: string;
  full_name: string;  // Changed from name to full_name to match API
  username: string;
  age: number;
  role: 'admin' | 'worker';
  photo_url?: string;  // API returns photo_url, not photoUrl
  photoPath?: string;
  photoData?: string; // Base64 encoded image data for client-side preview
  lastDetection?: string;
  message?: string;    // API includes a message field
};

// Backend API base URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Fetches all users from the backend API
 * GET /api/v1/users/profiles
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profiles`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

/**
 * Fetches a specific user by username
 * GET /api/v1/users/profile/{username}
 */
export const fetchUserByUsername = async (username: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/${username}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch user ${username}:`, error);
    throw error;
  }
};

/**
 * Adds a new user with photo to the backend API using multipart/form-data
 * POST /api/v1/users/profile
 */
export const addUser = async (userData: User, photoBlob: Blob): Promise<User> => {
  try {
    // Create a FormData object
    const formData = new FormData();
    
    // Append user data according to updated API requirements
    formData.append('username', userData.username);
    formData.append('full_name', userData.full_name);
    formData.append('age', userData.age.toString());
    formData.append('role', userData.role);
    
    // Append photo as a file (optional)
    if (photoBlob) {
      formData.append('photo', photoBlob, 'profile.jpg');
    }

    // Send the multipart request
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'POST',
      body: formData,
      // Note: Do not set Content-Type header when sending FormData
      // The browser will automatically set the correct boundary
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to add user:', error);
    throw error;
  }
};

/**
 * Deletes a user by username
 * DELETE /api/v1/users/profile/{username}
 */
export const deleteUser = async (username: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/${username}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

/**
 * Helper function to convert a base64 data URL to a Blob
 */
export const dataURLToBlob = (dataURL: string): Blob => {
  // Split the data URL to get the data part
  const parts = dataURL.split(',');
  const byteString = atob(parts[1]);
  
  // Get the MIME type from the data URL
  const mimeMatch = dataURL.match(/data:([^;]+);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  
  // Convert base64 to raw binary data
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  
  // Create and return a Blob
  return new Blob([arrayBuffer], { type: mimeType });
};