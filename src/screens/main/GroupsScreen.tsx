import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  FAB,
  Searchbar,
  Chip,
  Button,
  Menu,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { GroupsStackParamList } from '@navigation/MainTabNavigator';
import { theme, spacing, typography } from '@constants/theme';
import { Group, GroupCategory } from '@types/entities';
import { GroupService } from '@services/GroupService';

type GroupsNavigationProp = StackNavigationProp<GroupsStackParamList, 'GroupsList'>;

interface GroupCardProps {
  group: Group;
  onPress: () => void;
  onLongPress: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onPress, onLongPress }) => {
  const getCategoryIcon = (category: GroupCategory) => {
    switch (category) {
      case GroupCategory.HOME:
        return 'home';
      case GroupCategory.TRIP:
        return 'airplane';
      case GroupCategory.COUPLE:
        return 'heart';
      default:
        return 'account-group';
    }
  };

  const getCategoryColor = (category: GroupCategory) => {
    switch (category) {
      case GroupCategory.HOME:
        return '#FF6B6B';
      case GroupCategory.TRIP:
        return '#4ECDC4';
      case GroupCategory.COUPLE:
        return '#FF8E53';
      default:
        return theme.colors.primary;
    }
  };

  const totalBalance = group.balances?.reduce((sum, balance) => sum + Math.abs(balance.balance), 0) || 0;

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <Card style={styles.groupCard}>
        <Card.Content style={styles.groupCardContent}>
          <View style={styles.groupCardHeader}>
            <Avatar.Icon
              size={48}
              icon={getCategoryIcon(group.category)}
              style={[
                styles.groupAvatar,
                { backgroundColor: getCategoryColor(group.category) }
              ]}
            />
            <View style={styles.groupInfo}>
              <Text style={styles.groupName} numberOfLines={1}>
                {group.name}
              </Text>
              <Text style={styles.groupDescription} numberOfLines={2}>
                {group.description || 'No description'}
              </Text>
              <View style={styles.groupMeta}>
                <Chip
                  icon="account"
                  style={styles.memberChip}
                  textStyle={styles.chipText}
                >
                  {group.members.length}
                </Chip>
                <Chip
                  icon="receipt"
                  style={styles.expenseChip}
                  textStyle={styles.chipText}
                >
                  {group.expenses?.length || 0}
                </Chip>
              </View>
            </View>
          </View>

          <View style={styles.groupCardFooter}>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Total Expenses</Text>
              <Text style={styles.balanceAmount}>
                ${group.totalExpenses?.toFixed(2) || '0.00'}
              </Text>
            </View>
            {totalBalance > 0 && (
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Outstanding</Text>
                <Text style={[styles.balanceAmount, styles.outstandingAmount]}>
                  ${totalBalance.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export const GroupsScreen: React.FC = () => {
  const navigation = useNavigation<GroupsNavigationProp>();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GroupCategory | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    data: groups,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: () => GroupService.getUserGroups(),
  });

  const filteredGroups = groups?.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['groups'] });
  };

  const handleGroupPress = (groupId: string) => {
    navigation.navigate('GroupDetail', { groupId });
  };

  const handleGroupLongPress = (group: Group) => {
    // Could show action sheet for edit/delete options
    console.log('Long pressed group:', group.name);
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleCategoryFilter = (category: GroupCategory | null) => {
    setSelectedCategory(category);
    setMenuVisible(false);
  };

  const renderGroupCard: ListRenderItem<Group> = ({ item }) => (
    <GroupCard
      group={item}
      onPress={() => handleGroupPress(item.id)}
      onLongPress={() => handleGroupLongPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="account-group-outline" size={80} color={theme.colors.outline} />
      <Text style={styles.emptyTitle}>No Groups Found</Text>
      <Text style={styles.emptyDescription}>
        {searchQuery || selectedCategory
          ? 'Try adjusting your search or filters'
          : 'Create your first group to start splitting expenses with others'}
      </Text>
      {!searchQuery && !selectedCategory && (
        <Button
          mode="contained"
          onPress={handleCreateGroup}
          style={styles.emptyButton}
        >
          Create Your First Group
        </Button>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.screenTitle}>My Groups</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="text"
              onPress={() => setMenuVisible(true)}
              contentStyle={styles.filterButtonContent}
            >
              <Icon name="filter-variant" size={20} />
              Filter
            </Button>
          }
        >
          <Menu.Item
            onPress={() => handleCategoryFilter(null)}
            title="All Categories"
            leadingIcon={selectedCategory === null ? 'check' : undefined}
          />
          <Divider />
          <Menu.Item
            onPress={() => handleCategoryFilter(GroupCategory.HOME)}
            title="Home"
            leadingIcon={selectedCategory === GroupCategory.HOME ? 'check' : 'home'}
          />
          <Menu.Item
            onPress={() => handleCategoryFilter(GroupCategory.TRIP)}
            title="Trip"
            leadingIcon={selectedCategory === GroupCategory.TRIP ? 'check' : 'airplane'}
          />
          <Menu.Item
            onPress={() => handleCategoryFilter(GroupCategory.COUPLE)}
            title="Couple"
            leadingIcon={selectedCategory === GroupCategory.COUPLE ? 'check' : 'heart'}
          />
          <Menu.Item
            onPress={() => handleCategoryFilter(GroupCategory.GENERAL)}
            title="General"
            leadingIcon={selectedCategory === GroupCategory.GENERAL ? 'check' : 'account-group'}
          />
        </Menu>
      </View>

      <Searchbar
        placeholder="Search groups..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />

      {(searchQuery || selectedCategory) && (
        <View style={styles.filterChips}>
          {searchQuery && (
            <Chip
              mode="outlined"
              onClose={() => setSearchQuery('')}
              style={styles.filterChip}
            >
              "{searchQuery}"
            </Chip>
          )}
          {selectedCategory && (
            <Chip
              mode="outlined"
              onClose={() => setSelectedCategory(null)}
              style={styles.filterChip}
            >
              {selectedCategory}
            </Chip>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          (!filteredGroups || filteredGroups.length === 0) && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateGroup}
        label="New Group"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  screenTitle: {
    ...typography.largeTitle,
    color: theme.colors.textPrimary,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    marginBottom: spacing.md,
    backgroundColor: theme.colors.surface,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  filterChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  groupCard: {
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupCardContent: {
    paddingVertical: spacing.lg,
  },
  groupCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  groupAvatar: {
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
  groupDescription: {
    ...typography.body,
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  groupMeta: {
    flexDirection: 'row',
  },
  memberChip: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginRight: spacing.sm,
  },
  expenseChip: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  chipText: {
    fontSize: 12,
  },
  groupCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    ...typography.caption1,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    ...typography.title3,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  outstandingAmount: {
    color: theme.colors.warning,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.title2,
    color: theme.colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
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