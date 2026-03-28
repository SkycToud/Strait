import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const BUCKET_NAME = 'strait-infomation.firebasestorage.app';

let serviceAccount: any;
try {
  serviceAccount = require('../firebase-admin-key.json');
} catch (e) {
  console.error("ローカルに firebase-admin-key.json が見つかりません。");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET_NAME
  });
}

const bucket = admin.storage().bucket();

const categories = [
  {
    id: "Ball Sports",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE5MIpvovt1ayVVRQxwDOvsNItl-AaR6Ss9ahl8aIcPBICYjp2fUlQY2Wd2PVTqf_RL-FtlC5FxrFy0OdB2Ydeo9FsPrDFJgbMIC3hcYO0VJ4wNjyB0eaGtP2rAb_eGi4nfixn0sk3AU9ehKYCXKr6lDJuzDBPy9wQcu-8wwu_OarEQLqSJ-Osy9pZFFIlkUJGE2DJ9zovLzld_R44byfGOVaNxAnxqYJj0jLhfZQmYpBRq5WRsXdcLkJnYlqI-mqBY5z3c0zYNykS",
  },
  {
    id: "Track & Field / Martial Arts",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8I_p9IrIT_3YKf6T0lyc0Q4uKFMkgey72TnSIl-isfsO2jgtHXIJXAvG-fUOj8H4JFApbLClLwbT6iGXAovOepAtl25M4Ri4cxOFAotSMVJIv8fHGM-eXoog3Yk0vcJsVOs-wNS4ct-HlIEpUPE31-XBo7mHj8PQEwWA6BGlZHMJO8gZW2D8tkFopJUlX2VNAV_vty3Ey_K49YE7fZRGuYh4qHExU217qCsfvOqFyPZpGGXY_fIp5PzPmW46t1RmOQEOS_sbQmjSI",
  },
  {
    id: "Martial Arts",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT3_GifpEMcgmWe-54bSMGP5Z7MAHhO6gepspL4Z40kTkizq8sop90wrdjageDevIM0J4i-xpfHvQZ8EP-Jc1GN4Lp1z4qGNoyONrI0uMsYKpB8aeCY5SIImF235rX1hNHFaW8G3axG-8_5ORhW9nGpSYhDQboXneMlxEktNawMjp8ZJ-Ev6yCM4ESDV3IsUVJvSuVX2IUfH2mLMhlLPrUg7mRjay1ETL3To9L76tD6Iiu4gVmEKjmb0smtoYdT2osZnhNj1CkUQPB",
  },
  {
    id: "Dance & Performance",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2SJOuppRsLXr9u3lY853NR6yHlaHHCIJr-d_8nFmfqNKKzym08ZxOORpccs27veg1Z0U8SlxasJFXCanRV7qIuFEQ-LuCsmDX5ZpDamALlMORvop8MpGUPtlbPX6Z6VSmA04VCzWvZrQYk-z43WF6CRZbQVJVAd-OiJFugG5XJR5n7ROQ1uZpvJBxDpLyIiDxY2J8CdFdS8bbkjiqg9sd5ARU1_Krzhk3qxNydNMAbep5M0m-9zccveiUlGN_EiPfKcyDj9Ohv0vB",
  },
  {
    id: "Music & Arts",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPaHYuKQtX01FXnucaA1UC3Tz8Q3CEmRiES9d8xQuDcBh8iBP2inGgULOJkPnZbSJViGi8bqmzIPkkOkLPMXgLtGi9lxKikzfMVXxr0HbvZ0WjPS4dV1aScDUnXouNaRWXp4W9ksw7lG0r7Ygr10p5sMJvc4QevnnUDmaZwftYyBHzRtXWxRhgRaxwDINLWGvO53HlDYb9EhcA1GVNkXvoZubRufbokcXci5IBiNg0ROJVfc6-wOOQNjeJzghNBTTxypSbGdXad1Fv",
  },
  {
    id: "Japanese Culture",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZHRu5hqi7xHd6IXmdXwAF3ZhqU_wdDW58wHhRyVlma2zx6SlHhrIsFoOU1KnAyIrmfyF8WXeLgBjGHc5gH3pWyrJVD0umpkpM02sX9W7TpmZAnXf9TwhCc4bFbQFQGud7eAZwl05SivDlPc0_8qhrRs9xC-yXhqRBs6AJt4fM6kQVw7ZAOa4t7tP1ogVsQRS9w3wy842retHkeslT_PeBWv4E5VsilO7cZk84GYxJpfvpN_tfq1T0je6wF566i5cZ12N8NveF5ffR",
  },
  {
    id: "Language & Social",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0pqhHWxRpwtdXRmDtNHjzDQk36LNiWZWi4aOUdQrSnKw5oAuWSfEM9ViajABvSWPTheT5HINae8c5gQo7vTz8GJM6okExV2A_TvLjyTkom2LYTwsL6pIzJk_aND6WlJK1gJvrMnNWvzhnNDrnJAGVOK5nA2E1BVL6Qd0Q9lfQ0HeFZprJ1hyCcmswkgA0k5Sau0Sm5p4RXU_3HANYJQNL_z8THqzCHswrSOyPsosbzjaw7L0cy3i3-bA6Ips_YL9nZGMLIU37I4GP",
  },
  {
    id: "Volunteer",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmxvIM53yLk4kvrWJtplAGESLMyGltAts2EgMdzJxTuP23slqY2oXwJbWtngZBl8wHYAZFObH4BdywxKq1fORiJ3p_68CbADaktv0dZ6_2DY6t_Dv6mf5QrSJj9g96lIbM5wiu9zZtQNadJK_ALuzYIsax_Q7xbAv0zjiqkOS0qR3T7dcVg3pTStrZu2VcesFodwrs3U_G10fusqjKVvhLBV-4kxxCVtmXNef_5eS1l_HvMzLaG4xP-iSI9Fn4-lOg0MTrCCZzDNK9",
  },
  {
    id: "Hobbies",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxcqZyBJUSG7DFDim3hdaZQxA0evECZBrjRPj7IuyL_PRgCJ-18ltsRdWGRgWmicfPsXjHyC998aY0KA_k335DA7dhOWNq6Zqq3jfdiaUsINEtqEeozQiXQMzgDgmf8rIA39DP8ql9NEM3yB81JBzF38qiQTtzxnAeKaIcu8Gk2jFRKPiCdUHLHreIliYw71KPQbgLY3rR0JpSqoGZk_7wo7A8JidwBlhVud9feuQ7_O8LwhJcVcLVCeDteswLQvhGcHzoUVwmjXnE",
  }
];

async function run() {
  console.log('--- カテゴリ画像のFirebase移行開始 ---');
  const newUrls: Record<string, string> = {};

  for (const cat of categories) {
    console.log(`${cat.id} の画像をダウンロード中...`);
    
    // 画像ダウンロード
    const res = await fetch(cat.img);
    if (!res.ok) {
      console.error(`ダウンロード失敗: ${cat.id}`);
      continue;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Cloud Storage デスティネーションパス（例：images/categories/ball-sports.jpg）
    const slug = cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const destPath = `images/categories/${slug}.jpg`;
    const downloadToken = crypto.randomUUID();
    
    console.log(`${cat.id} をFirebaseにアップロード中... -> ${destPath}`);
    const file = bucket.file(destPath);
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          firebaseStorageDownloadTokens: downloadToken
        }
      }
    });
    
    // Firebase URL組み立て
    const encodedPath = encodeURIComponent(destPath);
    const newUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodedPath}?alt=media&token=${downloadToken}`;
    newUrls[cat.id] = newUrl;
  }
  
  // page.tsxのソースコードを書き換える
  console.log('src/app/clubs/page.tsx を更新中...');
  const pagePath = path.join(__dirname, '../src/app/clubs/page.tsx');
  let content = fs.readFileSync(pagePath, 'utf8');
  
  for (const cat of categories) {
    if (newUrls[cat.id]) {
      content = content.replace(cat.img, newUrls[cat.id]);
    }
  }
  
  fs.writeFileSync(pagePath, content, 'utf8');
  console.log('\n🎉 カテゴリ画像のFirebase移行がすべて完了しました！');
}

run().catch(console.error);
