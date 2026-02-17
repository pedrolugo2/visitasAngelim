# visitasAngelim

School Visit Scheduling and CRM System for Escola Angelim (Waldorf school).

## Deploy to Production

### Prerequisites

1. [Firebase CLI](https://firebase.google.com/docs/cli) installed and authenticated:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. A Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)
3. Firestore, Authentication, and Cloud Functions enabled in the project
4. Environment variables configured for the frontend (`.env.production` in `packages/frontend/`):
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
5. Email service credentials set as Firebase Functions secrets (for visit confirmations/reminders):
   ```bash
   firebase functions:secrets:set SMTP_HOST
   firebase functions:secrets:set SMTP_PORT
   firebase functions:secrets:set SMTP_USER
   firebase functions:secrets:set SMTP_PASS
   ```

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Build all packages (shared -> functions -> frontend)
npm run build

# 3. Deploy Firestore rules and indexes
firebase deploy --only firestore

# 4. Deploy Cloud Functions
firebase deploy --only functions

# 5. Deploy frontend (Firebase Hosting)
firebase deploy --only hosting

# Or deploy everything at once
firebase deploy
```

### First-time setup

After deploying, create an admin user:

1. Go to Firebase Console > Authentication and create a user (email/password)
2. Add a document to the `admins` Firestore collection:
   ```json
   {
     "email": "admin@yourdomain.com",
     "name": "Admin Name",
     "createdAt": "<server timestamp>"
   }
   ```
3. The admin can now log in at `/admin/login`
