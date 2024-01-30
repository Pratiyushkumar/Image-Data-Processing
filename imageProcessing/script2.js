const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const firestoreImageData2 = require('./cronjob/firestoreImageData');
const dotenv = require('dotenv');
dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const imagePath = path.resolve(process.cwd(), 'images/');
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

(() => {
  fs.readdir(imagePath, async (err, files) => {
    if (err) {
      console.log('Error reading image folder:', err);
      process.exit(0);
    } else {
      for (let image of files) {
        const ImageData = await firestoreImageData2(image);
        const imagePaths = `${imagePath}/${image}`;
        if (ImageData) {
          const params = {
            Bucket: bucketName,
            Key: `assets/${image}`,
            Body: fs.readFileSync(imagePaths),
            ContentType: 'image/png',
          };
          const command = new PutObjectCommand(params);
          await s3Client.send(command);
          console.log(`Data inserted for ${image}`);
        } else {
          console.log(`Data already present for ${image}`);
        }
        fs.unlink(imagePaths, (err) => {
          if (err) {
            console.error('Error deleting file:', imagePaths, err);
          } else {
            console.log('Deleted file:', imagePaths);
          }
        });
      }
    }
  });
})();
