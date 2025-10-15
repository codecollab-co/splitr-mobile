import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { DashboardScreen } from '@screens/main/DashboardScreen';
import { GroupsScreen } from '@screens/main/GroupsScreen';
import { ExpensesScreen } from '@screens/main/ExpensesScreen';
import { ProfileScreen } from '@screens/main/ProfileScreen';

import { GroupDetailScreen } from '@screens/main/GroupDetailScreen';
import { ExpenseDetailScreen } from '@screens/main/ExpenseDetailScreen';
import { AddExpenseScreen } from '@screens/main/AddExpenseScreen';
import { CreateGroupScreen } from '@screens/main/CreateGroupScreen';
import { SettingsScreen } from '@screens/main/SettingsScreen';

import { theme } from '@constants/theme';

export type MainTabParamList = {
  Dashboard: undefined;
  Groups: undefined;
  Expenses: undefined;
  Profile: undefined;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  GroupDetail: { groupId: string };
  ExpenseDetail: { expenseId: string };
  AddExpense: { groupId?: string };
};

export type GroupsStackParamList = {
  GroupsList: undefined;
  GroupDetail: { groupId: string };
  CreateGroup: undefined;
  AddExpense: { groupId: string };
  ExpenseDetail: { expenseId: string };
};

export type ExpensesStackParamList = {
  ExpensesList: undefined;
  ExpenseDetail: { expenseId: string };
  AddExpense: { groupId?: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createStackNavigator<DashboardStackParamList>();
const GroupsStack = createStackNavigator<GroupsStackParamList>();
const ExpensesStack = createStackNavigator<ExpensesStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

const DashboardStackNavigator = () => (
  <DashboardStack.Navigator>
    <DashboardStack.Screen
      name="DashboardHome"
      component={DashboardScreen}
      options={{ title: 'Dashboard' }}
    />
    <DashboardStack.Screen
      name="GroupDetail"
      component={GroupDetailScreen}
      options={{ title: 'Group Details' }}
    />
    <DashboardStack.Screen
      name="ExpenseDetail"
      component={ExpenseDetailScreen}
      options={{ title: 'Expense Details' }}
    />
    <DashboardStack.Screen
      name="AddExpense"
      component={AddExpenseScreen}
      options={{ title: 'Add Expense' }}
    />
  </DashboardStack.Navigator>
);

const GroupsStackNavigator = () => (
  <GroupsStack.Navigator>
    <GroupsStack.Screen
      name="GroupsList"
      component={GroupsScreen}
      options={{ title: 'Groups' }}
    />
    <GroupsStack.Screen
      name="GroupDetail"
      component={GroupDetailScreen}
      options={{ title: 'Group Details' }}
    />
    <GroupsStack.Screen
      name="CreateGroup"
      component={CreateGroupScreen}
      options={{ title: 'Create Group' }}
    />
    <GroupsStack.Screen
      name="AddExpense"
      component={AddExpenseScreen}
      options={{ title: 'Add Expense' }}
    />
    <GroupsStack.Screen
      name="ExpenseDetail"
      component={ExpenseDetailScreen}
      options={{ title: 'Expense Details' }}
    />
  </GroupsStack.Navigator>
);

const ExpensesStackNavigator = () => (
  <ExpensesStack.Navigator>
    <ExpensesStack.Screen
      name="ExpensesList"
      component={ExpensesScreen}
      options={{ title: 'Expenses' }}
    />
    <ExpensesStack.Screen
      name="ExpenseDetail"
      component={ExpenseDetailScreen}
      options={{ title: 'Expense Details' }}
    />
    <ExpensesStack.Screen
      name="AddExpense"
      component={AddExpenseScreen}
      options={{ title: 'Add Expense' }}
    />
  </ExpensesStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileHome"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
  </ProfileStack.Navigator>
);

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'Groups':
              iconName = focused ? 'account-group' : 'account-group-outline';
              break;
            case 'Expenses':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopColor: theme.colors.divider,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackNavigator}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsStackNavigator}
        options={{ title: 'Groups' }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesStackNavigator}
        options={{ title: 'Expenses' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};