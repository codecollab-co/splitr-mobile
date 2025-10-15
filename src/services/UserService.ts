import { apiService } from './ApiService';

export interface User {
  _id: string;
  clerkUserId: string;
  email: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSyncData {
  clerkUserId: string;
  email: string;
  name: string;
  imageUrl?: string;
}

class UserServiceClass {
  async syncUserFromClerk(userData: UserSyncData): Promise<User> {
    const response = await apiService.post<User>('/users/sync', userData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to sync user');
    }
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/users/profile');
    if (!response.success) {
      throw new Error(response.error || 'Failed to get current user');
    }
    return response.data;
  }

  async updateProfile(data: Partial<Pick<User, 'name' | 'imageUrl'>>): Promise<User> {
    const response = await apiService.put<User>('/users/profile', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update profile');
    }
    return response.data;
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await apiService.get<User[]>('/users/search', { q: query });
    if (!response.success) {
      throw new Error(response.error || 'Failed to search users');
    }
    return response.data;
  }

  async getUserById(userId: string): Promise<User> {
    const response = await apiService.get<User>(`/users/${userId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get user');
    }
    return response.data;
  }

  async getUsersByIds(userIds: string[]): Promise<User[]> {
    const response = await apiService.post<User[]>('/users/batch', { userIds });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch users');
    }
    return response.data;
  }

  async uploadAvatar(imageUri: string): Promise<string> {
    const file = {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    };

    const response = await apiService.uploadFile('/users/avatar', file);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to upload avatar');
    }

    return response.data.imageUrl;
  }

  async deleteAccount(): Promise<void> {
    const response = await apiService.delete<null>('/users/profile');
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete account');
    }
  }

  async getPreferences(): Promise<any> {
    const response = await apiService.get<any>('/users/preferences');
    if (!response.success) {
      throw new Error(response.error || 'Failed to get preferences');
    }
    return response.data || {};
  }

  async updatePreferences(preferences: any): Promise<any> {
    const response = await apiService.put<any>('/users/preferences', preferences);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update preferences');
    }
    return response.data || {};
  }
}

export const userService = new UserServiceClass();