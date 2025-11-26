import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Event } from '@/types';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onFavoriteToggle: () => void;
}

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

export default function EventCard({ event, onPress, onFavoriteToggle }: EventCardProps) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(false);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Event Type Badge */}
      <View style={[styles.badge, { backgroundColor: getEventTypeColor(event.type) }]}>
        <Text style={styles.badgeText}>{event.type}</Text>
      </View>

      {/* Favorite Button */}
      <TouchableOpacity
        style={[styles.favoriteButton, { backgroundColor: colors.background }]}
        onPress={onFavoriteToggle}
      >
        <Feather
          name={event.isFavorite ? 'heart' : 'heart'}
          size={20}
          color={event.isFavorite ? '#FF6B6B' : colors.textSecondary}
          fill={event.isFavorite ? '#FF6B6B' : 'none'}
        />
      </TouchableOpacity>

      {/* Event Details */}
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>{getEventEmoji(event.type)}</Text>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {event.title}
          </Text>
          {(event.imageUrl || event.description) && (
            <TouchableOpacity
              onPress={() => setIsExpanded(!isExpanded)}
              style={styles.expandButton}
            >
              <Feather
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoRow}>
          <Feather name="calendar" size={14} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {formatDate(event.date)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="clock" size={14} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="map-pin" size={14} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>
            {event.location}
          </Text>
        </View>

        {event.isCompleted && (
          <View style={styles.completedBadge}>
            <Feather name="check-circle" size={14} color="#4CAF50" />
            <Text style={[styles.completedText, { color: '#4CAF50' }]}>Completed</Text>
          </View>
        )}

        {/* Collapsible Section */}
        {isExpanded && (event.imageUrl || event.description) && (
          <View style={styles.expandedContent}>
            {event.imageUrl && (
              <Image source={{ uri: event.imageUrl }} style={styles.expandedImage} />
            )}
            {event.description && (
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {event.description}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1,
  },
  details: {
    padding: Spacing.md,
    paddingTop: Spacing.xl + Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  emoji: {
    fontSize: FontSizes.xl,
  },
  title: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  expandButton: {
    padding: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  completedText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  expandedContent: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  expandedImage: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    resizeMode: 'cover',
  },
  description: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.sm * 1.5,
  },
});
