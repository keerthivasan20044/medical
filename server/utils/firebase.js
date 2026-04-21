import admin from 'firebase-admin';
import config from '../config/config.js';

/**
 * Firebase Notification Enclave
 * Synchronizes push notification broadcasts across user nodes.
 */
try {
  if (config.firebase.projectId && config.firebase.privateKey && config.firebase.clientEmail) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        privateKey: config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail,
      }),
    });
    console.log('✅ Firebase Admin Node: Initialized Successfully.');
  } else {
    console.warn('⚠️ Firebase Admin Node: Missing credentials. Notifications disabled.');
  }
} catch (error) {
  console.error('❌ Firebase Initialization Failure:', error.message);
}

export default admin;
