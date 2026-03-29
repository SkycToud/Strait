const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin-key.json');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'strait-infomation.firebasestorage.app'
  });
}
const bucket = admin.storage().bucket();
async function run() {
  const file = bucket.file('images/clubs/kemari.jpg');
  const [metadata] = await file.getMetadata();
  const token = metadata.metadata.firebaseStorageDownloadTokens;
  console.log('TOKEN=' + token);
}
run();
