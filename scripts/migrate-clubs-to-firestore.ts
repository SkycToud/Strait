import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { toCategorySlug } from '../src/lib/club-categories';

const CLUBS_DIR = path.join(__dirname, '../src/content/clubs');
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../firebase-admin-key.json');

// サービスアカウントキーの読み込み
let serviceAccount: any;
try {
  serviceAccount = require(SERVICE_ACCOUNT_PATH);
} catch (e) {
  console.error("エラー: 'firebase-admin-key.json' がプロジェクトルートに見つかりません。");
  console.error("Firebase Console から ダウンロードして配置してください。");
  process.exit(1);
}

// Firebase Admin SDK初期化
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
db.settings({ databaseId: 'clubs' });

async function migrateClubs() {
  console.log('--- Firestore クラブデータ移行スクリプト開始 ---');

  if (!fs.existsSync(CLUBS_DIR)) {
    console.error(`エラー: ${CLUBS_DIR} が見つかりません。`);
    process.exit(1);
  }

  const files = fs.readdirSync(CLUBS_DIR).filter(file => file.endsWith('.md'));
  console.log(`${files.length} 個のMarkdownファイルを移行します。`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const id = file.replace(/\.md$/, '');
    const filePath = path.join(CLUBS_DIR, file);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // カテゴリの処理
      const rawCategory = data.categories ?? data.category;
      const categories = (Array.isArray(rawCategory) ? rawCategory : (rawCategory ? [rawCategory] : []))
        .map((value) => String(value).trim())
        .filter((value) => value.length > 0);
      const categorySlugs = categories.map(toCategorySlug);
      const primaryCategorySlug = categorySlugs[0] ?? 'others';

      // Markdownのフロントマター（data）をそのままベースにする
      const clubData: any = { ...data };

      // id はファイル名から取得
      clubData.id = id;

      // カテゴリだけは検索用に扱いやすく正規化して上書き・追加
      clubData.categories = categories;
      clubData.categorySlugs = categorySlugs;
      clubData.primaryCategorySlug = primaryCategorySlug;

      // lastUpdated がない場合は今日の日付を追加
      if (!clubData.lastUpdated) {
        clubData.lastUpdated = new Date().toISOString().split('T')[0];
      }

      // Firestoreに保存
      const docRef = db.collection('clubs').doc(id);
      await docRef.set(clubData);

      console.log(` ✅ 成功: ${id} (${clubData.nameJa})`);
      successCount++;

    } catch (error) {
      console.error(` ❌ 失敗: ${id} - ${(error as Error).message}`);
      errorCount++;
    }
  }

  console.log(`\n--- 移行完了 ---`);
  console.log(`成功: ${successCount} 件`);
  console.log(`失敗: ${errorCount} 件`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

migrateClubs().catch(console.error);
