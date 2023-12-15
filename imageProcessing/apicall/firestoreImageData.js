const { ImageCollection } = require('../firestore');
const firestore = require('firebase-admin').firestore();

const firestoreImageData = async (req) => {
  const firstoreData = {
    imageURL: req.file.originalname,
    imageUsageCount: 0,
    imageId: crypto.randomUUID(),
    createAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  };
  const collectionRef = await firestore.collection('Images');
  const result = await collectionRef
    .where('imageURL', '==', firstoreData.imageURL)
    .get();
  if (result.size > 0) {
    return false;
  }
  await ImageCollection.add(firstoreData);
  return true;
};

module.exports = firestoreImageData;
