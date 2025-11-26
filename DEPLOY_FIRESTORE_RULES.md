# Deploy Firestore Rules to Firebase

## Option 1: Firebase Console

1. Go to Firebase Console
2. Copy and paste these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events collection - users can only access their own events
    match /events/{eventId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

4. Wait 10-20 seconds for rules to take effect

## Option 2: Firebase CLI (For Future Deployments)

```powershell
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Test After Deployment

Try these actions in your app:
- Create an event
- Toggle favorite
- Edit an event
- Delete an event

All should work without permission errors!
