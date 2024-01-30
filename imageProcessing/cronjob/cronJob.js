const firestoreImageData = require('./firestoreImageData');
const imageProcessing = require('./imageProcessing');
const fs = require('fs');

async function uploadImage() {
  try {
    const imagePath = './images';
    fs.readdir(imagePath, (err, files) => {
      console.log(files);
      if (err) {
        console.log('Error reading image folder:', err);
      } else {
        files.forEach(async (image) => {
          const ImageData = await firestoreImageData(image);
          if (ImageData) {
            await imageProcessing(image);
            return { message: 'Data Inserted in db' };
          } else {
            return { message: 'Data already present in db' };
          }
        });
      }
    });
  } catch (error) {
    return { message: error };
  }
}

module.exports = uploadImage;
