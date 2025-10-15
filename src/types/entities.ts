export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  category: GroupCategory;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  expenses: Expense[];
  totalExpenses: number;
  balances: Balance[];
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: GroupRole;
  joinedAt: string;
  user: User;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  receiptUrl?: string;
  groupId: string;
  paidById: string;
  createdAt: string;
  updatedAt: string;
  group: Group;
  paidBy: User;
  splits: ExpenseSplit[];
}

export interface ExpenseSplit {
  id: string;
  expenseId: string;
  userId: string;
  amount: number;
  splitType: SplitType;
  percentage?: number;
  createdAt: string;
  user: User;
  expense: Expense;
}

export interface Settlement {
  id: string;
  amount: number;
  description?: string;
  status: SettlementStatus;
  groupId: string;
  payerId: string;
  payeeId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  group: Group;
  payer: User;
  payee: User;
}

export interface Balance {
  userId: string;
  groupId: string;
  balance: number;
  user: User;
  group: Group;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  userId: string;
  groupId?: string;
  expenseId?: string;
  settlementId?: string;
  createdAt: string;
  user: User;
  group?: Group;
  expense?: Expense;
  settlement?: Settlement;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  read: boolean;
  createdAt: string;
  user: User;
}

// Enums
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

export enum SettlementStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum ActivityType {
  EXPENSE_CREATED = 'expense_created',
  EXPENSE_UPDATED = 'expense_updated',
  EXPENSE_DELETED = 'expense_deleted',
  SETTLEMENT_CREATED = 'settlement_created',
  SETTLEMENT_COMPLETED = 'settlement_completed',
  SETTLEMENT_REJECTED = 'settlement_rejected',
  GROUP_CREATED = 'group_created',
  GROUP_UPDATED = 'group_updated',
  MEMBER_ADDED = 'member_added',
  MEMBER_REMOVED = 'member_removed',
  MEMBER_ROLE_CHANGED = 'member_role_changed',
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

// API Types
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

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  category: ExpenseCategory;
  receiptUrl?: string;
  groupId: string;
  splits: CreateExpenseSplitRequest[];
}

export interface CreateExpenseSplitRequest {
  userId: string;
  amount?: number;
  splitType: SplitType;
  percentage?: number;
}

export interface UpdateExpenseRequest {
  description?: string;
  amount?: number;
  category?: ExpenseCategory;
  receiptUrl?: string;
  splits?: CreateExpenseSplitRequest[];
}

export interface CreateSettlementRequest {
  amount: number;
  description?: string;
  groupId: string;
  payeeId: string;
}

export interface UserSyncRequest {
  clerkUserId: string;
  email: string;
  name: string;
  imageUrl?: string;
}

// Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Chart Data Types
export interface ExpenseChartData {
  date: string;
  amount: number;
  category: ExpenseCategory;
}

export interface BalanceChartData {
  userId: string;
  userName: string;
  balance: number;
  color: string;
}

export interface CategorySpendingData {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  color: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface GroupFormData {
  name: string;
  description?: string;
  category: GroupCategory;
  imageUrl?: string;
}

export interface ExpenseFormData {
  description: string;
  amount: string;
  category: ExpenseCategory;
  receiptUrl?: string;
  groupId: string;
  splitType: SplitType;
  splits: ExpenseSplitFormData[];
}

export interface ExpenseSplitFormData {
  userId: string;
  amount?: string;
  percentage?: string;
  selected: boolean;
}

export interface SettlementFormData {
  amount: string;
  description?: string;
  payeeId: string;
}

// Navigation Types
export interface ExpenseDetailParams {
  expenseId: string;
}

export interface GroupDetailParams {
  groupId: string;
}

export interface AddExpenseParams {
  groupId?: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type CreateUpdateDifference<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;