# Security Guide - Resetting Exposed Firebase API Keys

## GitHub detected exposed Firebase API keys in the repository

### Step 1: Reset Firebase API Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **campuspro-a516b**
3. Click on the ⚙️ (Settings) icon → **Project settings**
4. Go to the **General** tab
5. Scroll down to **Your apps** section
6. Find your web app (1:783482001470:web:7ee5ad5a9c3bbc4bb9d96f)
7. Click the **⋮** (three dots) menu
8. Select **Delete this app** 
9. Confirm deletion
10. Click **Add app** → **Web** (</>) 
11. Register a new app with the same name: **CampusPro**
12. Copy the new configuration values

### Step 2: Update Environment Variables

1. Open the `.env` file in your project root
2. Replace the Firebase configuration values with the new ones:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=<new_api_key>
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=<new_auth_domain>
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=<new_project_id>
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=<new_storage_bucket>
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<new_sender_id>
   EXPO_PUBLIC_FIREBASE_APP_ID=<new_app_id>
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=<new_measurement_id>
   ```

### Step 3: Update Firebase Security Rules (Important!)

Since the API key is client-side and visible in the app, you must secure your Firebase project with proper security rules.

#### Firestore Security Rules
Already configured in `firestore.rules` - deployed

#### Firebase Authentication
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Make sure only your actual domains are listed (remove any test domains)
3. Enable **App Check** for additional security:
   - Go to **Build** → **App Check**
   - Register your app
   - This prevents unauthorized access even with the API key

### Step 4: Remove API Keys from Git History

The old API keys are still in your Git history. To remove them:

```bash
# Option 1: Simple approach - Start fresh (if acceptable)
# Delete the repository from GitHub and push again

# Option 2: Advanced - Rewrite Git history (be careful!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch config/firebase.ts" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

**Note:** Rewriting Git history is risky. If other people have cloned the repo, coordinate with them.

### Step 5: Restart Your Development Server

```bash
npm start -- --clear
```

### Step 6: Verify Security

1. `.env` file is in `.gitignore`
2. `config/firebase.ts` uses environment variables
3. `.env.example` is committed (without real values)
4. Firestore rules are properly configured
5. Firebase API key has been reset
6. Old API keys removed from Git history

### Additional Security Best Practices

1. **Never commit sensitive data** - API keys, passwords, tokens
2. **Use Firebase App Check** - Protects your backend from abuse
3. **Enable Security Rules** - Firestore, Storage, Realtime Database
4. **Monitor Firebase Usage** - Set up alerts for unusual activity
5. **Use Secret Scanners** - GitHub has built-in secret scanning
6. **Review Access** - Regularly audit who has access to your Firebase project

### What if I can't delete the app?

If deleting and recreating the app isn't an option:

1. **Set up Application restrictions** in Firebase Console
2. Go to **Project Settings** → **General** → **Your apps**
3. Under your web app, configure:
   - **App domains** (restrict to specific domains)
   - **API restrictions** in Google Cloud Console
4. Enable **App Check** (strongly recommended)

### Testing After Reset

1. Start the app: `npm start`
2. Test authentication (login, signup)
3. Test Firestore operations (create/read/update/delete events)
4. Verify profile photo upload works
5. Check password reset functionality

---

## Current Status

- Environment variables configured
- `.env` added to `.gitignore`
-  **ACTION REQUIRED**: Reset Firebase API key (follow Step 1)
-  **ACTION REQUIRED**: Update `.env` with new keys (follow Step 2)
-  **OPTIONAL**: Remove keys from Git history (follow Step 4)

## Resources

- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
