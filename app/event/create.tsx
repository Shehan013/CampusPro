import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import CustomInput from '@/components/CustomInput';
import { Event, EventType } from '@/types';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { createEvent } from '@/services/eventService';

const EVENT_TYPES: EventType[] = ['Assignment', 'Entertainment', 'Exam', 'Special', 'Sport', 'Industry Visit'];

export default function CreateEventScreen() {
  const { colors } = useTheme();
  const { user, firebaseUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form state
  const [eventType, setEventType] = useState<EventType>('Assignment');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!date.trim()) newErrors.date = 'Date is required';
    if (!startTime.trim()) newErrors.startTime = 'Start time is required';
    if (!endTime.trim()) newErrors.endTime = 'End time is required';
    if (!location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    // Use firebaseUser as fallback if user object isn't loaded yet
    const userId = user?.uid || firebaseUser?.uid;
    
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create an event');
      return;
    }

    try {
      setLoading(true);

      await createEvent(userId, {
        type: eventType,
        title: title.trim(),
        date: date.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        location: location.trim(),
        description: description.trim(),
        imageUri: imageUri,
      });

      Alert.alert(
        'Success!',
        'Event created successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Create event error:', error);
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: EventType): string => {
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

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: colors.text }]}>Create Event</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Add a new event to your calendar
          </Text>
        </View>

        {/* Event Type Selector */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Event Type *</Text>
          <View style={styles.typeGrid}>
            {EVENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: eventType === type ? getEventTypeColor(type) : colors.surface,
                    borderColor: eventType === type ? getEventTypeColor(type) : colors.inputBorder,
                  },
                ]}
                onPress={() => setEventType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    { color: eventType === type ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <CustomInput
            label="Event Title *"
            placeholder="Enter event title"
            icon="file-text"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />

          <CustomInput
            label="Date (YYYY-MM-DD) *"
            placeholder="2025-12-31"
            icon="calendar"
            value={date}
            onChangeText={setDate}
            error={errors.date}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <CustomInput
                label="Start Time *"
                placeholder="09:00 AM"
                icon="clock"
                value={startTime}
                onChangeText={setStartTime}
                error={errors.startTime}
              />
            </View>
            <View style={styles.halfWidth}>
              <CustomInput
                label="End Time *"
                placeholder="11:00 AM"
                icon="clock"
                value={endTime}
                onChangeText={setEndTime}
                error={errors.endTime}
              />
            </View>
          </View>

          <CustomInput
            label="Location *"
            placeholder="Enter location"
            icon="map-pin"
            value={location}
            onChangeText={setLocation}
            error={errors.location}
          />

          <View style={styles.textAreaContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.inputText,
                },
              ]}
              placeholder="Enter event description (optional)"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Image Picker */}
          <View style={styles.imageSection}>
            <Text style={[styles.label, { color: colors.text }]}>Event Image</Text>
            
            {imageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={[styles.removeImageButton, { backgroundColor: colors.surface }]}
                  onPress={removeImage}
                >
                  <Feather name="x" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.imagePicker, { backgroundColor: colors.surface, borderColor: colors.inputBorder }]}
                onPress={pickImage}
              >
                <Feather name="image" size={32} color={colors.textSecondary} />
                <Text style={[styles.imagePickerText, { color: colors.textSecondary }]}>
                  Tap to add image from gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: colors.primary },
            loading && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather name="plus" size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Event</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  typeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  textAreaContainer: {
    marginBottom: Spacing.md,
  },
  textArea: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    minHeight: 100,
  },
  imageSection: {
    marginBottom: Spacing.md,
  },
  imagePicker: {
    height: 150,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  imagePickerText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createButton: {
    height: 56,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
});
