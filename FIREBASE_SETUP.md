# Firebase Firestore Rules Setup

## Current Error
```
FirebaseError: Missing or insufficient permissions
```

## Solution

Go to [Firebase Console](https://console.firebase.google.com/project/campuspro-a516b/firestore/rules) and update your Firestore Security Rules:

### For Development (Temporary - Allow authenticated users to read/write)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - allow users to create and read their own documents
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events collection - allow authenticated users to read all, write their own
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.createdBy == request.auth.uid;
    }
  }
}
```

### For Testing ONLY (Not recommended for production)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Steps to Update

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: **campuspro-a516b**
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab
5. Paste the development rules above
6. Click **Publish**

## AsyncStorage Warning

The warning about AsyncStorage is informational. Firebase Auth will use memory persistence by default in React Native, which means:
- Auth state persists during app session
- Auth state clears when app is completely closed
- This is acceptable for development and most use cases

If you want persistent auth across app restarts, you would need to configure `AsyncStorage` properly, but that requires ejecting from Expo or using a custom build.
