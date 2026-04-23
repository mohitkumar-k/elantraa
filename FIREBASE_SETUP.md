# Firebase Setup For ELANTRAA

## 1. Create the Firebase project

1. Go to the Firebase Console.
2. Create a project for `ELANTRAA`.
3. Enable:
   - Authentication
   - Firestore Database
   - Storage
   - Hosting

## 2. Enable sign-in providers

- Email/Password
- Google

For Google sign-in, add your local and production domains in the Firebase Authentication authorized domains list.

## 3. Add web app config

Copy [.env.example](./.env.example) to `.env` and fill:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_RAZORPAY_KEY_ID=
VITE_ADMIN_EMAIL=
```

`VITE_ADMIN_EMAIL` must match the email you use for `/admin`.

## 4. Attach the Firebase project locally

Copy [.firebaserc.example](./.firebaserc.example) to `.firebaserc` and replace the placeholder with your actual Firebase project id.

Then run:

```bash
npm run firebase:login
npm run firebase:deploy
```

## 5. Update security rules

Open these files and replace `ADMIN_EMAIL_PLACEHOLDER` with the same email from `VITE_ADMIN_EMAIL`:

- [firestore.rules](./firestore.rules)
- [storage.rules](./storage.rules)

Then deploy rules:

```bash
npx firebase-tools deploy --only firestore:rules,storage
```

## 6. Seed demo data

After `.env` is filled, run:

```bash
npm run seed:demo
```

This creates demo categories and 10 products in Firestore.

## 7. Notes

- The app currently falls back to demo/local data when Firebase env values are missing.
- Orders are only writable for signed-in users in the sample Firestore rules.
- The current Razorpay flow uses `checkout.js` on the client. For production signature verification, move order creation and payment verification to a backend or Cloud Function.
