import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from './theme/ThemeContext';

export default function DashboardScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Welcome back, John!
        </Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
            <FontAwesome5 name="chart-bar" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Projects</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '15' }]}>
            <FontAwesome5 name="users" size={20} color={colors.secondary} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>8</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Groups</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.success + '15' }]}>
            <FontAwesome5 name="check-circle" size={20} color={colors.success} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.activityCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.activityIconContainer, { backgroundColor: colors.info + '15' }]}>
            <FontAwesome5 name="file-alt" size={16} color={colors.info} />
          </View>
          <View style={styles.activityContent}>
            <Text style={[styles.activityTitle, { color: colors.text }]}>Project Report Updated</Text>
            <Text style={[styles.activityTime, { color: colors.textSecondary }]}>2 hours ago</Text>
          </View>
        </View>

        <View style={[styles.activityCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.activityIconContainer, { backgroundColor: colors.success + '15' }]}>
            <FontAwesome5 name="tasks" size={16} color={colors.success} />
          </View>
          <View style={styles.activityContent}>
            <Text style={[styles.activityTitle, { color: colors.text }]}>Task Completed</Text>
            <Text style={[styles.activityTime, { color: colors.textSecondary }]}>Yesterday</Text>
          </View>
        </View>

        <View style={[styles.activityCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.activityIconContainer, { backgroundColor: colors.primary + '15' }]}>
            <FontAwesome5 name="comment-alt" size={16} color={colors.primary} />
          </View>
          <View style={styles.activityContent}>
            <Text style={[styles.activityTitle, { color: colors.text }]}>New Comment</Text>
            <Text style={[styles.activityTime, { color: colors.textSecondary }]}>2 days ago</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
            <FontAwesome5 name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>New Project</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.secondary }]}>
            <FontAwesome5 name="user-plus" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Member</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.success }]}>
            <FontAwesome5 name="calendar-plus" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.info }]}>
            <FontAwesome5 name="cog" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '31%',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
}); 