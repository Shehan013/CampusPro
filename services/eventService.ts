import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '@/config/firebase';
import { Event, EventType } from '@/types';
import { handleError } from '../utils/errorHandler';

const EVENTS_COLLECTION = 'events';

export interface CreateEventData {
  type: EventType;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  imageUri?: string | null;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  isFavorite?: boolean;
  isCompleted?: boolean;
}

// Create a new event in Firestore

export const createEvent = async (
  userId: string,
  eventData: CreateEventData
): Promise<string> => {
  try {
    const eventDoc = {
      userId,
      type: eventData.type,
      title: eventData.title,
      date: eventData.date,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      location: eventData.location,
      description: eventData.description,
      imageUrl: eventData.imageUri || null,
      isFavorite: false,
      isCompleted: false,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), eventDoc);
    return docRef.id;
  } catch (error) {
    throw new Error(handleError(error, 'Create Event'));
  }
};

// Get a single event by ID
export const getEvent = async (eventId: string): Promise<Event | null> => {
  try {
    const eventDoc = await getDoc(doc(db, EVENTS_COLLECTION, eventId));
    
    if (!eventDoc.exists()) {
      return null;
    }

    const data = eventDoc.data();
    return {
      id: eventDoc.id,
      userId: data.userId,
      type: data.type,
      title: data.title,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      description: data.description,
      imageUrl: data.imageUrl,
      isFavorite: data.isFavorite || false,
      isCompleted: data.isCompleted || false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(handleError(error, 'Get Event'));
  }
};

// Get all events for a specific user
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const events: Event[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        userId: data.userId,
        type: data.type,
        title: data.title,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        description: data.description,
        imageUrl: data.imageUrl,
        isFavorite: data.isFavorite || false,
        isCompleted: data.isCompleted || false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    // Sort by createdAt in memory (descending - newest first)
    events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return events;
  } catch (error) {
    throw new Error(handleError(error, 'Get User Events'));
  }
};

// Update an existing event
export const updateEvent = async (
  eventId: string,
  updates: UpdateEventData
): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(handleError(error, 'Update Event'));
  }
};

// Delete an event
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
  } catch (error) {
    throw new Error(handleError(error, 'Delete Event'));
  }
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (
  eventId: string,
  currentStatus: boolean
): Promise<void> => {
  try {
    await updateEvent(eventId, { isFavorite: !currentStatus });
  } catch (error) {
    throw new Error(handleError(error, 'Toggle Favorite'));
  }
};

// Toggle completed status
export const toggleCompleted = async (
  eventId: string,
  currentStatus: boolean
): Promise<void> => {
  try {
    await updateEvent(eventId, { isCompleted: !currentStatus });
  } catch (error) {
    throw new Error(handleError(error, 'Toggle Completed'));
  }
};
