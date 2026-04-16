import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// サーバーサイドでのFirebase Admin SDK初期化
let app: admin.app.App;

if (!admin.apps.length) {
  // サービスアカウントキーの読み込み
  const serviceAccountKey = process.env.FIREBASE_ADMIN_KEY;
  
  if (serviceAccountKey) {
    // 環境変数から読み込み（本番環境用）
    const serviceAccount = JSON.parse(serviceAccountKey);
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // ローカル開発用：ファイルから読み込み
    try {
      const serviceAccount = require('../../firebase-admin-key.json');
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (e) {
      console.error('Firebase Admin SDKの初期化に失敗しました。');
      console.error('環境変数 FIREBASE_ADMIN_KEY を設定するか、firebase-admin-key.json を配置してください。');
      throw e;
    }
  }
} else {
  app = admin.apps[0]!;
}

export const db = getFirestore(app, 'clubs');
export { app };
