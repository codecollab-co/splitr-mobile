import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, Card, Avatar, Button, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import { DashboardStackParamList } from '@navigation/MainTabNavigator';
import { theme, spacing, typography } from '@constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { Group, Expense, Balance, groupService } from '@services/GroupService';
import { ExpenseService } from '@services/ExpenseService';
import { configService } from '@services/ConfigService';

const { width } = Dimensions.get('window');

type DashboardNavigationProp = StackNavigationProp<DashboardStackParamList, 'DashboardHome'>;

interface BalanceCardProps {
  title: string;
  amount: number;
  color: string;
  icon: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ title, amount, color, icon }) => (
  <Card style={[styles.balanceCard, { borderLeftColor: color }]}>
    <Card.Content style={styles.balanceCardContent}>
      <View style={styles.balanceCardHeader}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.balanceCardTitle}>{title}</Text>
      </View>
      <Text style={[styles.balanceAmount, { color }]}>
        {amount >= 0 ? '+' : ''}${Math.abs(amount).toFixed(2)}
      </Text>
    </Card.Content>
  </Card>
);

interface GroupCardProps {
  group: Group;
  onPress: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Card style={styles.groupCard}>
      <Card.Content style={styles.groupCardContent}>
        <View style={styles.groupCardHeader}>
          <Avatar.Text
            size={48}
            label={group.name.substring(0, 2).toUpperCase()}
            style={styles.groupAvatar}
          />
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupMembers}>
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <Text style={styles.groupBalance}>
          ${group.totalExpenses?.toFixed(2) || '0.00'}
        </Text>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

interface RecentExpenseProps {
  expense: Expense;
  onPress: () => void;
}

const RecentExpense: React.FC<RecentExpenseProps> = ({ expense, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.expenseItem}>
      <View style={styles.expenseIcon}>
        <Icon name="receipt" size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseDescription}>{expense.description}</Text>
        <Text style={styles.expenseGroup}>{expense.group?.name}</Text>
      </View>
      <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
    </View>
  </TouchableOpacity>
);

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: groups,
    isLoading: groupsLoading,
    refetch: refetchGroups,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupService.getUserGroups(),
  });

  const {
    data: recentExpenses,
    isLoading: expensesLoading,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: ['expenses', 'recent'],
    queryFn: () => ExpenseService.getRecentExpenses(10),
  });

  const {
    data: balanceData,
    isLoading: balanceLoading,
  } = useQuery({
    queryKey: ['balances', 'summary'],
    queryFn: () => ExpenseService.getBalanceSummary(),
  });

  const isRefreshing = groupsLoading || expensesLoading || balanceLoading;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['groups'] });
    queryClient.invalidateQueries({ queryKey: ['expenses'] });
    queryClient.invalidateQueries({ queryKey: ['balances'] });
  };

  const handleGroupPress = (groupId: string) => {
    navigation.navigate('GroupDetail', { groupId });
  };

  const handleExpensePress = (expenseId: string) => {
    navigation.navigate('ExpenseDetail', { expenseId });
  };

  const handleAddExpense = () => {
    navigation.navigate('AddExpense', {});
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getEnvironmentIndicator = () => {
    if (configService.isDevelopment) {
      return (
        <View style={styles.environmentIndicator}>
          <Text style={styles.environmentText}>
            Dev ({configService.databaseMode === 'postgres' ? 'PostgreSQL' : 'Convex'})
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Environment Indicator for Development */}
        {getEnvironmentIndicator()}

        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
            <Avatar.Text
              size={56}
              label={user?.name?.substring(0, 2).toUpperCase() || 'U'}
              style={styles.avatar}
            />
          </View>
        </LinearGradient>

        {/* Balance Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balance Overview</Text>
          <View style={styles.balanceGrid}>
            <BalanceCard
              title="You Owe"
              amount={balanceData?.totalOwed || 0}
              color={theme.colors.negative}
              icon="arrow-up"
            />
            <BalanceCard
              title="Owed to You"
              amount={balanceData?.totalOwedToYou || 0}
              color={theme.colors.positive}
              icon="arrow-down"
            />
          </View>
        </View>

        {/* Recent Groups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Groups</Text>
            <Button
              mode="text"
              compact
              onPress={() => navigation.getParent()?.navigate('Groups')}
            >
              View All
            </Button>
          </View>

          {groups && groups.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.groupsList}
            >
              {groups.slice(0, 5).map((group) => (
                <GroupCard
                  key={group._id}
                  group={group}
                  onPress={() => handleGroupPress(group._id)}
                />
              ))}
            </ScrollView>
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyCardContent}>
                <Icon name="account-group-outline" size={48} color={theme.colors.outline} />
                <Text style={styles.emptyTitle}>No Groups Yet</Text>
                <Text style={styles.emptyDescription}>
                  Create your first group to start splitting expenses
                </Text>
                <Button
                  mode="contained"
                  onPress={() => navigation.getParent()?.navigate('Groups')}
                  style={styles.emptyButton}
                >
                  Create Group
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <Button
              mode="text"
              compact
              onPress={() => navigation.getParent()?.navigate('Expenses')}
            >
              View All
            </Button>
          </View>

          {recentExpenses && recentExpenses.length > 0 ? (
            <Card style={styles.expensesCard}>
              <Card.Content style={styles.expensesContent}>
                {recentExpenses.slice(0, 5).map((expense) => (
                  <RecentExpense
                    key={expense._id}
                    expense={expense}
                    onPress={() => handleExpensePress(expense._id)}
                  />
                ))}
              </Card.Content>
            </Card>
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyCardContent}>
                <Icon name="receipt-outline" size={48} color={theme.colors.outline} />
                <Text style={styles.emptyTitle}>No Expenses Yet</Text>
                <Text style={styles.emptyDescription}>
                  Add your first expense to get started
                </Text>
                <Button
                  mode="contained"
                  onPress={handleAddExpense}
                  style={styles.emptyButton}
                >
                  Add Expense
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddExpense}
        label="Add Expense"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  environmentIndicator: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  environmentText: {
    ...typography.caption1,
    color: theme.colors.surface,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...typography.callout,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  userName: {
    ...typography.title2,
    color: theme.colors.surface,
    fontWeight: '700',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.title3,
    color: theme.colors.textPrimary,
  },
  balanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceCardContent: {
    paddingVertical: spacing.md,
  },
  balanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  balanceCardTitle: {
    ...typography.footnote,
    color: theme.colors.textSecondary,
    marginLeft: spacing.sm,
  },
  balanceAmount: {
    ...typography.title2,
    fontWeight: '700',
  },
  groupsList: {
    paddingVertical: spacing.sm,
  },
  groupCard: {
    width: 200,
    marginRight: spacing.md,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupCardContent: {
    paddingVertical: spacing.md,
  },
  groupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  groupAvatar: {
    backgroundColor: theme.colors.primary,
    marginRight: spacing.md,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    ...typography.headline,
    color: theme.colors.textPrimary,
    marginBottom: spacing.xs,
  },
  groupMembers: {
    ...typography.caption1,
    color: theme.colors.textSecondary,
  },
  groupBalance: {
    ...typography.title3,
    color: theme.colors.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  expensesCard: {
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  expensesContent: {
    paddingVertical: spacing.sm,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    ...typography.body,
    color: theme.colors.textPrimary,
    marginBottom: spacing.xs,
  },
  expenseGroup: {
    ...typography.caption1,
    color: theme.colors.textSecondary,
  },
  expenseAmount: {
    ...typography.headline,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  emptyCard: {
    elevation: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    ...typography.headline,
    color: theme.colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
  },
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 80,
    backgroundColor: theme.colors.primary,
  },
});