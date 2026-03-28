import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// JSONを整形維持したまま保存するためのパッケージ等は使わず標準でいきます
const CLUBS_JSON_PATH = path.join(__dirname, '../src/data/clubs.json');
const PUBLIC_DIR = path.join(__dirname, '../public');
const BUCKET_NAME = 'strait-infomation.firebasestorage.app';

// サービスアカウントキーの読み込み
let serviceAccount: any;
try {
  serviceAccount = require('../firebase-admin-key.json');
} catch (e) {
  console.error("エラー: 'firebase-admin-key.json' がプロジェクトルートに見つかりません。");
  console.error("Firebase Console から ダウンロードして配置してください。");
  process.exit(1);
}

// 既に初期化されていなければ初期化する
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET_NAME
  });
}

const bucket = admin.storage().bucket();

async function uploadImage(localPath: string, destinationPath: string): Promise<string> {
  const absolutePath = path.join(PUBLIC_DIR, localPath);
  
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Local file not found: ${absolutePath}`);
  }

  // Firebase の公開用ダウントークンを生成
  const downloadToken = crypto.randomUUID();

  // Storageにアップロード
  await bucket.upload(absolutePath, {
    destination: destinationPath,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: downloadToken
      }
    }
  });

  // ダウンロードURLの構築
  const encodedPath = encodeURIComponent(destinationPath);
  const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodedPath}?alt=media&token=${downloadToken}`;
  
  return url;
}

async function run() {
  console.log('--- Firebase 画像移行スクリプト開始 ---');
  
  // JSONを読み込み
  const rawData = fs.readFileSync(CLUBS_JSON_PATH, 'utf-8');
  const clubs = JSON.parse(rawData);
  let updatedCount = 0;

  for (const club of clubs) {
    if (club.thumbnail && club.thumbnail.startsWith('/images/')) {
      console.log(`アップロード中: ${club.id} (${club.thumbnail})`);
      
      const localPath = club.thumbnail;
      // Firebase上での保存先パス。ここではローカルの構造を維持するか、単純に clubs/xxx.jpg にする
      const destinationPath = localPath.replace(/^\//, ''); // 最初の / を取る (例: 'images/clubs/kemari.jpg')

      try {
        const newUrl = await uploadImage(localPath, destinationPath);
        console.log(` ✅ 成功 -> ${newUrl}`);
        
        // パスを書き換え
        club.thumbnail = newUrl;
        updatedCount++;
      } catch (e) {
        console.error(` ❌ 失敗: ${club.id} のアップロードに失敗しました。`, (e as Error).message);
      }
    } else if (club.thumbnail) {
      console.log(`スキップ: ${club.id} (既にローカルパスではありません)`);
    } else {
      console.log(`スキップ: ${club.id} (画像がありません)`);
    }
  }

  // 結果を保存
  if (updatedCount > 0) {
    fs.writeFileSync(CLUBS_JSON_PATH, JSON.stringify(clubs, null, 2), 'utf-8');
    console.log(`\n🎉 完了! 合計 ${updatedCount} 件のサークル画像パスを Firebase URL に更新し、clubs.json を上書きしました。`);
  } else {
    console.log('\n更新対象の画像はありませんでした。');
  }
}

run().catch(console.error);
