import React, { useState, useEffect } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import CustomInput from '@/components/CustomInput';
import { Event, EventType } from '@/types';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { getEvent, updateEvent } from '@/services/eventService';
import { handleError } from '../../../utils/errorHandler';

const EVENT_TYPES: EventType[] = ['Assignment', 'Entertainment', 'Exam', 'Special', 'Sport', 'Industry Visit'];

export default function EditEventScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
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

  // Load existing event data
  useEffect(() => {
    const loadEvent = async () => {
      if (id) {
        try {
          const event = await getEvent(id as string);
          if (event) {
            setEventType(event.type);
            setTitle(event.title);
            setDate(event.date);
            setStartTime(event.startTime);
            setEndTime(event.endTime);
            setLocation(event.location);
            setDescription(event.description);
            setImageUri(event.imageUrl || null);
          } else {
            Alert.alert('Error', 'Event not found');
            router.back();
          }
        } catch (error) {
          console.error('Error loading event:', error);
          Alert.alert('Error', 'Failed to load event');
          router.back();
        }
      }
    };
    
    loadEvent();
  }, [id]);

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
      console.error('Image picker error:', error);
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

  const handleUpdateEvent = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (!id) {
      Alert.alert('Error', 'Event ID is missing');
      return;
    }

    try {
      setLoading(true);

      await updateEvent(id as string, {
        type: eventType,
        title: title.trim(),
        date: date.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        location: location.trim(),
        description: description.trim(),
        imageUri: imageUri,
      });

      Alert.alert('Success', 'Event updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Update event error:', error);
      Alert.alert('Error', 'Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: EventType) => {
    const colors = {
      Assignment: '#FF6B6B',
      Entertainment: '#4ECDC4',
      Exam: '#FFE66D',
      Special: '#95E1D3',
      Sport: '#F38181',
      'Industry Visit': '#AA96DA',
    };
    return colors[type];
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Event</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Type Selector */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Event Type *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
            {EVENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  { 
                    backgroundColor: eventType === type ? getEventTypeColor(type) : colors.card,
                    borderColor: eventType === type ? getEventTypeColor(type) : colors.border,
                  }
                ]}
                onPress={() => setEventType(type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    { color: eventType === type ? '#FFFFFF' : colors.text }
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <CustomInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter event title"
            error={errors.title}
          />
        </View>

        {/* Date and Time */}
        <View style={styles.section}>
          <CustomInput
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="DD/MM/YYYY"
            error={errors.date}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <CustomInput
              label="Start Time"
              value={startTime}
              onChangeText={setStartTime}
              placeholder="HH:MM AM/PM"
              error={errors.startTime}
            />
          </View>
          <View style={styles.halfWidth}>
            <CustomInput
              label="End Time"
              value={endTime}
              onChangeText={setEndTime}
              placeholder="HH:MM AM/PM"
              error={errors.endTime}
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <CustomInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Enter event location"
            error={errors.location}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <View style={[styles.textAreaContainer, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          }]}>
            <TextInput
              style={[styles.textArea, { color: colors.text }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter event description"
              placeholderTextColor={colors.text + '80'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Image Picker */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Event Image</Text>
          
          {imageUri ? (
            <View style={styles.imageSection}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={[styles.removeImageButton, { backgroundColor: colors.card }]}
                onPress={removeImage}
              >
                <Feather name="x" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.imagePicker, { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }]}
              onPress={pickImage}
            >
              <Feather name="image" size={32} color={colors.text + '80'} />
              <Text style={[styles.imagePickerText, { color: colors.text }]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.updateButton, loading && styles.updateButtonDisabled]}
          onPress={handleUpdateEvent}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.updateButtonText}>Update Event</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  typeScroll: {
    flexGrow: 0,
  },
  typeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    borderWidth: 2,
  },
  typeButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  halfWidth: {
    flex: 1,
  },
  textAreaContainer: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.sm,
  },
  textArea: {
    fontSize: FontSizes.md,
    minHeight: 100,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  imageSection: {
    position: 'relative',
  },
  imagePicker: {
    height: 150,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  imagePickerText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButton: {
    backgroundColor: '#4A90E2',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
});
