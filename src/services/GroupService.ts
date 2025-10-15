import { apiService } from './ApiService';
import { configService } from './ConfigService';

export interface Group {
  _id: string;
  name: string;
  description?: string;
  category: GroupCategory;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  expenses?: Expense[];
  totalExpenses?: number;
  balances?: Balance[];
}

export interface GroupMember {
  _id: string;
  groupId: string;
  userId: string;
  role: GroupRole;
  joinedAt: string;
  user: User;
}

export interface User {
  _id: string;
  clerkUserId: string;
  email: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  receiptUrl?: string;
  groupId: string;
  paidById: string;
  createdAt: string;
  updatedAt: string;
  group?: Group;
  paidBy?: User;
  splits?: ExpenseSplit[];
}

export interface ExpenseSplit {
  _id: string;
  expenseId: string;
  userId: string;
  amount: number;
  splitType: SplitType;
  percentage?: number;
  createdAt: string;
  user?: User;
}

export interface Balance {
  userId: string;
  groupId: string;
  balance: number;
  user?: User;
  group?: Group;
}

export enum GroupCategory {
  HOME = 'home',
  TRIP = 'trip',
  COUPLE = 'couple',
  GENERAL = 'general',
}

export enum GroupRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum ExpenseCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ACCOMMODATION = 'accommodation',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  UTILITIES = 'utilities',
  OTHER = 'other',
}

export enum SplitType {
  EQUAL = 'equal',
  EXACT = 'exact',
  PERCENTAGE = 'percentage',
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  category: GroupCategory;
  imageUrl?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  category?: GroupCategory;
  imageUrl?: string;
}

class GroupServiceClass {
  /**
   * Get all groups for the current user
   */
  async getUserGroups(): Promise<Group[]> {
    try {
      configService.log('debug', 'Fetching user groups', {
        databaseMode: configService.databaseMode,
      });

      const response = await apiService.get<Group[]>('/groups');

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch groups');
      }

      configService.log('info', `Fetched ${response.data?.length || 0} groups`);
      return response.data || [];
    } catch (error) {
      configService.log('error', 'GroupService.getUserGroups error', error);
      throw error;
    }
  }

  /**
   * Get a specific group by ID
   */
  async getGroupById(groupId: string): Promise<Group> {
    try {
      configService.log('debug', `Fetching group: ${groupId}`);

      const response = await apiService.get<Group>(`/groups/${groupId}`);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Group not found');
      }

      return response.data;
    } catch (error) {
      configService.log('error', 'GroupService.getGroupById error', error);
      throw error;
    }
  }

  /**
   * Create a new group
   */
  async createGroup(groupData: CreateGroupRequest): Promise<Group> {
    try {
      configService.log('debug', 'Creating new group', {
        name: groupData.name,
        category: groupData.category,
        databaseMode: configService.databaseMode,
      });

      const response = await apiService.post<Group>('/groups', groupData);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create group');
      }

      configService.log('info', `Group created: ${response.data.name}`);
      return response.data;
    } catch (error) {
      configService.log('error', 'GroupService.createGroup error', error);
      throw error;
    }
  }

  /**
   * Update an existing group
   */
  async updateGroup(groupId: string, updates: UpdateGroupRequest): Promise<Group> {
    try {
      configService.log('debug', `Updating group: ${groupId}`, updates);

      const response = await apiService.put<Group>(`/groups/${groupId}`, updates);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update group');
      }

      configService.log('info', `Group updated: ${groupId}`);
      return response.data;
    } catch (error) {
      configService.log('error', 'GroupService.updateGroup error', error);
      throw error;
    }
  }

  /**
   * Delete a group
   */
  async deleteGroup(groupId: string): Promise<void> {
    try {
      configService.log('debug', `Deleting group: ${groupId}`);

      const response = await apiService.delete<null>(`/groups/${groupId}`);

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete group');
      }

      configService.log('info', `Group deleted: ${groupId}`);
    } catch (error) {
      configService.log('error', 'GroupService.deleteGroup error', error);
      throw error;
    }
  }

  /**
   * Add a member to a group
   */
  async addMember(groupId: string, email: string): Promise<Group> {
    try {
      configService.log('debug', `Adding member to group: ${groupId}`, { email });

      const response = await apiService.post<Group>(`/groups/${groupId}/members`, { email });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to add member');
      }

      configService.log('info', `Member added to group: ${groupId}`);
      return response.data;
    } catch (error) {
      configService.log('error', 'GroupService.addMember error', error);
      throw error;
    }
  }

  /**
   * Remove a member from a group
   */
  async removeMember(groupId: string, userId: string): Promise<Group> {
    try {
      configService.log('debug', `Removing member from group: ${groupId}`, { userId });

      const response = await apiService.delete<Group>(`/groups/${groupId}/members/${userId}`);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to remove member');
      }

      configService.log('info', `Member removed from group: ${groupId}`);
      return response.data;
    } catch (error) {
      configService.log('error', 'GroupService.removeMember error', error);
      throw error;
    }
  }

  /**
   * Leave a group
   */
  async leaveGroup(groupId: string): Promise<void> {
    try {
      configService.log('debug', `Leaving group: ${groupId}`);

      const response = await apiService.post<null>(`/groups/${groupId}/leave`);

      if (!response.success) {
        throw new Error(response.error || 'Failed to leave group');
      }

      configService.log('info', `Left group: ${groupId}`);
    } catch (error) {
      configService.log('error', 'GroupService.leaveGroup error', error);
      throw error;
    }
  }

  /**
   * Get group balances with database-aware optimization
   */
  async getGroupBalances(groupId: string): Promise<Balance[]> {
    try {
      configService.log('debug', `Fetching group balances: ${groupId}`);

      if (configService.isLocalDatabase) {
        // PostgreSQL: Use detailed balance calculation
        const response = await apiService.get<Balance[]>(`/groups/${groupId}/balances`);
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch group balances');
        }
        return response.data || [];
      } else {
        // Convex: Use optimized real-time balance queries
        const response = await apiService.optimizedQuery<Balance[]>(
          `/groups/${groupId}/balances`,
          null,
          { useCache: true, priority: 'high' }
        );
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch group balances');
        }
        return response.data || [];
      }
    } catch (error) {
      configService.log('error', 'GroupService.getGroupBalances error', error);
      throw error;
    }
  }

  /**
   * Search groups (public groups that user can join)
   */
  async searchPublicGroups(query: string): Promise<Group[]> {
    try {
      configService.log('debug', `Searching public groups: ${query}`);

      const response = await apiService.get<Group[]>('/groups/search', { q: query });

      if (!response.success) {
        throw new Error(response.error || 'Failed to search groups');
      }

      return response.data || [];
    } catch (error) {
      configService.log('error', 'GroupService.searchPublicGroups error', error);
      throw error;
    }
  }

  /**
   * Upload group image with progress tracking
   */
  async uploadGroupImage(
    groupId: string,
    imageUri: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      configService.log('debug', `Uploading group image: ${groupId}`);

      const file = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'group-image.jpg',
      };

      const response = await apiService.uploadFile(
        `/groups/${groupId}/image`,
        file,
        onProgress
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to upload group image');
      }

      configService.log('info', `Group image uploaded: ${groupId}`);
      return response.data.imageUrl;
    } catch (error) {
      configService.log('error', 'GroupService.uploadGroupImage error', error);
      throw error;
    }
  }

  /**
   * Generate group invite link
   */
  async generateInviteLink(groupId: string): Promise<string> {
    try {
      configService.log('debug', `Generating invite link for group: ${groupId}`);

      const response = await apiService.post<{ inviteLink: string }>(
        `/groups/${groupId}/invite`
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to generate invite link');
      }

      configService.log('info', `Invite link generated for group: ${groupId}`);
      return response.data.inviteLink;
    } catch (error) {
      configService.log('error', 'GroupService.generateInviteLink error', error);
      throw error;
    }
  }

  /**
   * Join group via invite link
   */
  async joinViaInvite(inviteCode: string): Promise<Group> {
    try {
      configService.log('debug', `Joining group via invite: ${inviteCode}`);

      const response = await apiService.post<Group>('/groups/join', {
        inviteCode,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to join group');
      }

      configService.log('info', `Joined group via invite: ${response.data.name}`);
      return response.data;
    } catch (error) {
      configService.log('error', 'GroupService.joinViaInvite error', error);
      throw error;
    }
  }
}

export const groupService = new GroupServiceClass();