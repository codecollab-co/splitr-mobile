import { ApiService } from './ApiService';
import {
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ApiResponse,
  PaginatedResponse,
  ExpenseCategory,
  SplitType,
} from '@types/entities';

export class ExpenseService {
  /**
   * Get recent expenses for the current user
   */
  static async getRecentExpenses(limit: number = 10): Promise<Expense[]> {
    try {
      const response = await ApiService.get<ApiResponse<Expense[]>>(
        `/expenses/recent?limit=${limit}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch recent expenses');
      }

      return response.data.data || [];
    } catch (error) {
      console.error('ExpenseService.getRecentExpenses error:', error);
      throw error;
    }
  }

  /**
   * Get user's expenses with pagination
   */
  static async getUserExpenses(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      groupId?: string;
      category?: ExpenseCategory;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<PaginatedResponse<Expense>> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...filters,
      });

      const response = await ApiService.get<ApiResponse<PaginatedResponse<Expense>>>(
        `/expenses?${queryParams}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch expenses');
      }

      return response.data.data;
    } catch (error) {
      console.error('ExpenseService.getUserExpenses error:', error);
      throw error;
    }
  }

  /**
   * Get a specific expense by ID
   */
  static async getExpenseById(expenseId: string): Promise<Expense> {
    try {
      const response = await ApiService.get<ApiResponse<Expense>>(
        `/expenses/${expenseId}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Expense not found');
      }

      return response.data.data;
    } catch (error) {
      console.error('ExpenseService.getExpenseById error:', error);
      throw error;
    }
  }

  /**
   * Create a new expense
   */
  static async createExpense(expenseData: CreateExpenseRequest): Promise<Expense> {
    try {
      const response = await ApiService.post<ApiResponse<Expense>>(
        '/expenses',
        expenseData
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to create expense');
      }

      return response.data.data;
    } catch (error) {
      console.error('ExpenseService.createExpense error:', error);
      throw error;
    }
  }

  /**
   * Update an existing expense
   */
  static async updateExpense(
    expenseId: string,
    updates: UpdateExpenseRequest
  ): Promise<Expense> {
    try {
      const response = await ApiService.put<ApiResponse<Expense>>(
        `/expenses/${expenseId}`,
        updates
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to update expense');
      }

      return response.data.data;
    } catch (error) {
      console.error('ExpenseService.updateExpense error:', error);
      throw error;
    }
  }

  /**
   * Delete an expense
   */
  static async deleteExpense(expenseId: string): Promise<void> {
    try {
      const response = await ApiService.delete<ApiResponse<null>>(
        `/expenses/${expenseId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to delete expense');
      }
    } catch (error) {
      console.error('ExpenseService.deleteExpense error:', error);
      throw error;
    }
  }

  /**
   * Upload receipt for an expense
   */
  static async uploadReceipt(
    expenseId: string,
    imageUri: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const file = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'receipt.jpg',
      };

      const response = await ApiService.uploadFile(
        `/expenses/${expenseId}/receipt`,
        file,
        onProgress
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to upload receipt');
      }

      return response.data.data.receiptUrl;
    } catch (error) {
      console.error('ExpenseService.uploadReceipt error:', error);
      throw error;
    }
  }

  /**
   * Get balance summary for the current user
   */
  static async getBalanceSummary(): Promise<{
    totalOwed: number;
    totalOwedToYou: number;
    netBalance: number;
  }> {
    try {
      const response = await ApiService.get<
        ApiResponse<{
          totalOwed: number;
          totalOwedToYou: number;
          netBalance: number;
        }>
      >('/expenses/balance-summary');

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch balance summary');
      }

      return response.data.data || { totalOwed: 0, totalOwedToYou: 0, netBalance: 0 };
    } catch (error) {
      console.error('ExpenseService.getBalanceSummary error:', error);
      throw error;
    }
  }

  /**
   * Get detailed balances for all groups
   */
  static async getDetailedBalances(): Promise<any[]> {
    try {
      const response = await ApiService.get<ApiResponse<any[]>>(
        '/expenses/detailed-balances'
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch detailed balances');
      }

      return response.data.data || [];
    } catch (error) {
      console.error('ExpenseService.getDetailedBalances error:', error);
      throw error;
    }
  }

  /**
   * Get expense analytics
   */
  static async getExpenseAnalytics(
    timeframe: 'week' | 'month' | 'year' = 'month',
    groupId?: string
  ): Promise<{
    totalSpent: number;
    categoryBreakdown: any[];
    trendData: any[];
    topExpenses: Expense[];
  }> {
    try {
      const queryParams = new URLSearchParams({ timeframe });
      if (groupId) {
        queryParams.append('groupId', groupId);
      }

      const response = await ApiService.get<
        ApiResponse<{
          totalSpent: number;
          categoryBreakdown: any[];
          trendData: any[];
          topExpenses: Expense[];
        }>
      >(`/expenses/analytics?${queryParams}`);

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch expense analytics');
      }

      return response.data.data || {
        totalSpent: 0,
        categoryBreakdown: [],
        trendData: [],
        topExpenses: [],
      };
    } catch (error) {
      console.error('ExpenseService.getExpenseAnalytics error:', error);
      throw error;
    }
  }

  /**
   * Split an expense equally among group members
   */
  static async splitExpenseEqually(
    expenseId: string,
    memberIds: string[]
  ): Promise<Expense> {
    try {
      const response = await ApiService.post<ApiResponse<Expense>>(
        `/expenses/${expenseId}/split-equally`,
        { memberIds }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to split expense equally');
      }

      return response.data.data;
    } catch (error) {
      console.error('ExpenseService.splitExpenseEqually error:', error);
      throw error;
    }
  }

  /**
   * Split an expense by exact amounts
   */
  static async splitExpenseExactly(
    expenseId: string,
    splits: { userId: string; amount: number }[]
  ): Promise<Expense> {
    try {
      const response = await ApiService.post<ApiResponse<Expense>>(
        `/expenses/${expenseId}/split-exactly`,
        { splits }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to split expense exactly');
      }

      return response.data.data;
    } catch (error) {
      console.error('ExpenseService.splitExpenseExactly error:', error);
      throw error;
    }
  }

  /**
   * Split an expense by percentages
   */
  static async splitExpenseByPercentage(
    expenseId: string,
    splits: { userId: string; percentage: number }[]
  ): Promise<Expense> {
    try {
      const response = await ApiService.post<ApiResponse<Expense>>(
        `/expenses/${expenseId}/split-percentage`,
        { splits }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to split expense by percentage');
      }

      return response.data.data;
    } catch (error) {
      console.error('ExpenseService.splitExpenseByPercentage error:', error);
      throw error;
    }
  }

  /**
   * Search expenses
   */
  static async searchExpenses(
    query: string,
    filters?: {
      groupId?: string;
      category?: ExpenseCategory;
      minAmount?: number;
      maxAmount?: number;
    }
  ): Promise<Expense[]> {
    try {
      const queryParams = new URLSearchParams({
        q: query,
        ...filters,
      });

      const response = await ApiService.get<ApiResponse<Expense[]>>(
        `/expenses/search?${queryParams}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to search expenses');
      }

      return response.data.data || [];
    } catch (error) {
      console.error('ExpenseService.searchExpenses error:', error);
      throw error;
    }
  }

  /**
   * Export expenses to CSV
   */
  static async exportExpenses(
    format: 'csv' | 'pdf' = 'csv',
    filters?: {
      groupId?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams({
        format,
        ...filters,
      });

      const response = await ApiService.get(
        `/expenses/export?${queryParams}`,
        {
          responseType: 'blob',
        }
      );

      return response.data;
    } catch (error) {
      console.error('ExpenseService.exportExpenses error:', error);
      throw error;
    }
  }

  /**
   * Get expense categories with spending totals
   */
  static async getCategoryTotals(
    timeframe: 'week' | 'month' | 'year' = 'month',
    groupId?: string
  ): Promise<Array<{
    category: ExpenseCategory;
    total: number;
    count: number;
    percentage: number;
  }>> {
    try {
      const queryParams = new URLSearchParams({ timeframe });
      if (groupId) {
        queryParams.append('groupId', groupId);
      }

      const response = await ApiService.get<
        ApiResponse<
          Array<{
            category: ExpenseCategory;
            total: number;
            count: number;
            percentage: number;
          }>
        >
      >(`/expenses/category-totals?${queryParams}`);

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch category totals');
      }

      return response.data.data || [];
    } catch (error) {
      console.error('ExpenseService.getCategoryTotals error:', error);
      throw error;
    }
  }
}