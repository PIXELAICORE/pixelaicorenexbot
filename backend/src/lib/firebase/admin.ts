import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
const serviceAccountPath = path.resolve(__dirname, '../../../../firebase-service-account.json');
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'pixel-aicore-nexbot',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'pixel-aicore-nexbot.firebasestorage.app'
};

// Check if service account file exists; if not, use environment variables
let serviceAccount: any = undefined;
try {
  const fs = await import('fs');
  if (fs.existsSync(serviceAccountPath)) {
    const content = fs.readFileSync(serviceAccountPath, 'utf-8');
    serviceAccount = JSON.parse(content);
  }
} catch (err) {
  console.warn('Service account file not found, using environment variables');
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket
  });
} else {
  // Fallback for development - will use FIREBASE_* environment variables
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export default admin;
