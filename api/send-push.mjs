import {initializeApp, cert, getApps, getApp} from 'firebase-admin/app';
import {getMessaging} from 'firebase-admin/messaging';
import {getFirestore} from 'firebase-admin/firestore';

function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase env variables are missing');
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Only POST method is allowed',
    });
  }

  const secret = req.headers['x-push-secret'];

  if (secret !== process.env.PUSH_SECRET) {
    return res.status(401).json({
      ok: false,
      error: 'Unauthorized',
    });
  }

  try {
    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : req.body || {};

    let {token, userId, title, message, url} = body;

    const app = getFirebaseApp();
    const db = getFirestore(app);
    const messaging = getMessaging(app);

    // Если token не передали вручную — берём его из Firestore
    if (!token) {
      const docId = userId || 'default-user';

      const doc = await db.collection('fcmTokens').doc(docId).get();

      if (!doc.exists) {
        return res.status(404).json({
          ok: false,
          error: 'FCM token not found in Firestore',
        });
      }

      const data = doc.data();

      if (!data || !data.token) {
        return res.status(400).json({
          ok: false,
          error: 'Token field is empty in Firestore',
        });
      }

      token = data.token;
    }

    const response = await messaging.send({
      token,

      notification: {
        title: title || 'Новое уведомление',
        body: message || 'Пуш отправлен с Vercel',
      },

      data: {
        url: url || 'https://network-pi-neon.vercel.app/',
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