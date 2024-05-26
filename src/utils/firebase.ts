import type { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import type { Messaging } from 'firebase/messaging';
import { getMessaging } from 'firebase/messaging';
import type { Auth } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
	firebaseApp = initializeApp({
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
		authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
		databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
		storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
		appId: import.meta.env.VITE_FIREBASE_APP_ID,
		measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
	});

	auth = getAuth(firebaseApp);
	db = getFirestore(firebaseApp);
} catch (error) {
	console.error('🔴 Something went wrong: ', error);
}

export {
	firebaseApp,
	auth,
	db,
};
