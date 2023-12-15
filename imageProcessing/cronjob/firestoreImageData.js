const { ImageCollection } = require('../firestore');
const firestore = require('firebase-admin').firestore();

const firestoreImageData2 = async (file) => {
  const firstoreData = {
    imageURL: file,
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
    console.log('data not getting inserted');
    return false;
  }
  console.log('data  getting inserted');
  await ImageCollection.add(firstoreData);
  return true;
};

module.exports = firestoreImageData2;
