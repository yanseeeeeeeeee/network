import admin from 'firebase-admin';

function initFirebase() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase env variables are missing');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
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

    const {token, title, message} = body;

    if (!token) {
      return res.status(400).json({
        ok: false,
        error: 'FCM token is required',
      });
    }

    const firebase = initFirebase();

    const response = await firebase.messaging().send({
      token,

      notification: {
        title: title || 'Тестовое уведомление',
        body: message || 'Пуш отправлен с Vercel',
      },

      data: {
        url: 'https://network-pi-neon.vercel.app/',
      },

      android: {
        priority: 'high',
      },
    });

    return res.status(200).json({
      ok: true,
      response,
    });
  } catch (error) {
    console.error('Push error:', error);

    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}