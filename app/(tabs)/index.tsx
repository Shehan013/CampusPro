import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import EventCard from '@/components/EventCard';
import { Event, EventFilter } from '@/types';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { getUserEvents, toggleFavorite } from '@/services/eventService';
import { handleError } from '../../utils/errorHandler';

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, firebaseUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState<EventFilter>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch events from Firestore
  const fetchEvents = async () => {
    const userId = user?.uid || firebaseUser?.uid;
    if (!userId) return;
    
    try {
      const userEvents = await getUserEvents(userId);
      setEvents(userEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load events on mount and when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [user, firebaseUser])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
  };

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Apply filter
    switch (activeFilter) {
      case 'upcoming':
        filtered = filtered.filter(e => !e.isCompleted && new Date(e.date) >= new Date());
        break;
      case 'completed':
        filtered = filtered.filter(e => e.isCompleted);
        break;
      case 'favorites':
        filtered = filtered.filter(e => e.isFavorite && !e.isCompleted);
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filtered;
  }, [events, activeFilter, searchQuery]);

  const handleFavoriteToggle = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    try {
      // Optimistically update UI
      setEvents(prevEvents =>
        prevEvents.map(e =>
          e.id === eventId ? { ...e, isFavorite: !e.isFavorite } : e
        )
      );

      // Update in Firestore
      await toggleFavorite(eventId, event.isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setEvents(prevEvents =>
        prevEvents.map(e =>
          e.id === eventId ? { ...e, isFavorite: event.isFavorite } : e
        )
      );
    }
  };

  const handleEventPress = (event: Event) => {
    // Navigate to event details
    router.push(`/event/${event.id}` as any);
  };

  const renderFilter = (filter: EventFilter, label: string, icon: keyof typeof Feather.glyphMap) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: activeFilter === filter ? colors.primary : colors.surface,
        },
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Feather
        name={icon}
        size={18}
        color={activeFilter === filter ? '#FFFFFF' : colors.textSecondary}
      />
      <Text
        style={[
          styles.filterText,
          {
            color: activeFilter === filter ? '#FFFFFF' : colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/settings' as any)}
          >
            <Feather name="user" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || firebaseUser?.displayName?.split(' ')[0] || 'Student'}!</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={toggleTheme}
        >
          <Feather name={isDark ? 'sun' : 'moon'} size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Feather name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search events..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {renderFilter('upcoming', 'Upcoming', 'clock')}
        {renderFilter('completed', 'Completed', 'check-circle')}
        {renderFilter('favorites', 'Favorites', 'heart')}
      </View>

      {/* Events List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => handleEventPress(item)}
              onFavoriteToggle={() => handleFavoriteToggle(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4A90E2']}
              tintColor="#4A90E2"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="calendar" size={64} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No events found
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                {activeFilter === 'favorites'
                  ? 'Mark events as favorite to see them here'
                  : 'Create your first event to get started'}
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/event/create' as any)}
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + Spacing.md : Spacing.xxl,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  greeting: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  filterText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    marginTop: Spacing.xs,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.xxl * 2,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
