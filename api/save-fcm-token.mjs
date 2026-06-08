import admin from 'firebase-admin';

function initFirebase() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }

  return admin;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Only POST method is allowed',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const {token, userId} = body;

    if (!token) {
      return res.status(400).json({
        ok: false,
        error: 'FCM token is required',
      });
    }

    const firebase = initFirebase();
    const db = firebase.firestore();

    const docId = userId || 'default-user';

    await db.collection('fcmTokens').doc(docId).set(
      {
        token,
        userId: docId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );

    return res.status(200).json({
      ok: true,
      message: 'FCM token saved',
    });
  } catch (error) {
    console.error('Save token error:', error);

    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}