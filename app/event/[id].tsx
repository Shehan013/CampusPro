import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Event } from '@/types';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { getEvent, deleteEvent, toggleFavorite, toggleCompleted } from '@/services/eventService';

export default function EventDetailsScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch event from Firestore
  useEffect(() => {
    const loadEvent = async () => {
      if (params.id) {
        try {
          setLoading(true);
          const fetchedEvent = await getEvent(params.id as string);
          setEvent(fetchedEvent);
        } catch (error) {
          console.error('Error loading event:', error);
          Alert.alert('Error', 'Failed to load event');
          router.back();
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadEvent();
  }, [params.id]);

  const getEventTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'Assignment': '#FF6B6B',
      'Entertainment': '#4ECDC4',
      'Exam': '#FFD93D',
      'Special': '#A8E6CF',
      'Sport': '#95E1D3',
      'Industry Visit': '#F38181',
    };
    return colors[type] || '#4A90E2';
  };

  const getEventEmoji = (type: string): string => {
    const emojis: { [key: string]: string } = {
      'Assignment': '📝',
      'Entertainment': '🎉',
      'Exam': '📚',
      'Special': '⭐',
      'Sport': '⚽',
      'Industry Visit': '🏢',
    };
    return emojis[type] || '📅';
  };

  const handleEdit = () => {
    router.push(`/event/edit/${params.id}` as any);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (params.id) {
                await deleteEvent(params.id as string);
                Alert.alert('Success', 'Event deleted successfully', [
                  { text: 'OK', onPress: () => router.back() },
                ]);
              }
            } catch (error: any) {
              console.error('Delete error:', error);
              Alert.alert('Error', error.message || 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async () => {
    if (event && params.id) {
      try {
        await toggleFavorite(params.id as string, event.isFavorite);
        setEvent({ ...event, isFavorite: !event.isFavorite });
      } catch (error) {
        console.error('Toggle favorite error:', error);
        Alert.alert('Error', 'Failed to update favorite status');
      }
    }
  };

  const handleToggleComplete = async () => {
    if (event && params.id) {
      try {
        await toggleCompleted(params.id as string, event.isCompleted);
        setEvent({ ...event, isCompleted: !event.isCompleted });
      } catch (error) {
        console.error('Toggle complete error:', error);
        Alert.alert('Error', 'Failed to update completion status');
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centered}>
          <Feather name="calendar" size={64} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Event not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Actions */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
          >
            <Feather
              name="heart"
              size={22}
              color={event.isFavorite ? '#FF6B6B' : colors.text}
              fill={event.isFavorite ? '#FF6B6B' : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEdit}
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
          >
            <Feather name="edit-2" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
          >
            <Feather name="trash-2" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Event Image */}
      {event.imageUrl && (
        <Image source={{ uri: event.imageUrl }} style={styles.image} />
      )}

      {/* Event Content */}
      <View style={styles.content}>
        {/* Event Type Badge */}
        <View style={[styles.badge, { backgroundColor: getEventTypeColor(event.type) }]}>
          <Text style={styles.badgeText}>{event.type}</Text>
        </View>

        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>{getEventEmoji(event.type)}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCards}>
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <Feather name="calendar" size={20} color={colors.primary} />
            <View style={styles.infoCardContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Date</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{event.date}</Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <Feather name="clock" size={20} color={colors.primary} />
            <View style={styles.infoCardContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Time</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {event.startTime} - {event.endTime}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <Feather name="map-pin" size={20} color={colors.primary} />
            <View style={styles.infoCardContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Location</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{event.location}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {event.description && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {event.description}
            </Text>
          </View>
        )}

        {/* Mark as Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            {
              backgroundColor: event.isCompleted ? colors.surface : colors.primary,
              borderColor: event.isCompleted ? colors.primary : 'transparent',
              borderWidth: event.isCompleted ? 1.5 : 0,
            },
          ]}
          onPress={handleToggleComplete}
        >
          <Feather
            name={event.isCompleted ? 'check-circle' : 'circle'}
            size={20}
            color={event.isCompleted ? colors.primary : '#FFFFFF'}
          />
          <Text
            style={[
              styles.completeButtonText,
              { color: event.isCompleted ? colors.primary : '#FFFFFF' },
            ]}
          >
            {event.isCompleted ? 'Completed' : 'Mark as Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    paddingTop: Spacing.xxl + Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  emoji: {
    fontSize: FontSizes.xxxl,
  },
  title: {
    flex: 1,
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  infoCards: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  infoCardContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs / 2,
  },
  infoValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.md * 1.6,
  },
  completeButton: {
    height: 56,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  completeButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing.lg,
  },
});
