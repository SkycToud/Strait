import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const CLUBS_JSON_PATH = path.join(__dirname, '../src/data/clubs.json');
const BUCKET_NAME = 'strait-infomation.firebasestorage.app';

let serviceAccount: any;
try {
  serviceAccount = require('../firebase-admin-key.json');
} catch (e) {
  console.error("エラー: 'firebase-admin-key.json' が見つかりません。");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET_NAME
  });
}

const bucket = admin.storage().bucket();

async function run() {
  const rawData = fs.readFileSync(CLUBS_JSON_PATH, 'utf-8');
  const clubs = JSON.parse(rawData);
  let updatedCount = 0;

  console.log("Fetching files from Firebase Storage...");
  // List all files in images/clubs/
  const [files] = await bucket.getFiles({ prefix: 'images/clubs/' });
  
  console.log(`Found ${files.length} files in images/clubs/.`);

  const map: Record<string, string> = {
    'amity': 'amity', // Assuming 'amity' id
    'argentinetango': 'argentinetangocircle',
    'art': 'artclub',
    'floorball': 'floorballclub',
    'imoni': 'regionalrevitalizationcircleimonikai',
    'koreandance': 'koreandanceclub',
    'omotesenke': 'omotesenketeaceremony',
    'souls': 'souls', // Assuming 'souls' id
    'tufuene': 'tafuene', 
    'tups': 'tups'
  };

  for (const club of clubs) {
    const clubId = club.id;
    const matchedFile = files.find(file => {
      const fileName = path.basename(file.name);
      const nameWithoutExt = path.parse(fileName).name;
      const baseName = nameWithoutExt.replace('2026_', '');
      return baseName === clubId || map[baseName] === clubId || nameWithoutExt === clubId;
    });

    if (matchedFile) {
      console.log(`Matched ${clubId} with ${matchedFile.name}`);
      
      // We need a download token to construct the URL. 
      const [metadata] = await matchedFile.getMetadata();
      let metadataObj = metadata.metadata;
      let downloadToken = metadataObj?.firebaseStorageDownloadTokens;

      if (!downloadToken) {
        // Generate a new download token if it doesn't exist
        const crypto = require('crypto');
        downloadToken = crypto.randomUUID();
        await matchedFile.setMetadata({
          metadata: {
            firebaseStorageDownloadTokens: downloadToken
          }
        });
        console.log(`Generated new download token for ${matchedFile.name}`);
      }

      const encodedPath = encodeURIComponent(matchedFile.name);
      const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodedPath}?alt=media&token=${downloadToken}`;
      
      if (club.thumbnail !== url) {
        club.thumbnail = url;
        updatedCount++;
        console.log(`Updated URL for ${clubId}`);
      }
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(CLUBS_JSON_PATH, JSON.stringify(clubs, null, 2), 'utf-8');
    console.log(`\nUpdated ${updatedCount} clubs.json entries!`);
  } else {
    console.log("\nNo updates needed.");
  }
}

run().catch(console.error);
