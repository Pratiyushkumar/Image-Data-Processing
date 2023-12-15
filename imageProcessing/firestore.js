const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const buffer = fs.readFileSync(
  path.resolve(process.cwd(), 'serviceAccountKey.json')
);

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(buffer)),
});

const db = admin.firestore();
const ImageCollection = db.collection('Images');

module.exports = { ImageCollection };
