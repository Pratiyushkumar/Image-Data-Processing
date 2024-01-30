const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const firestoreImageData2 = require('./cronjob/firestoreImageData');
// const dataPath = require("../images")

const bucketName = process.env.BUCKET_NAME;
const buckeRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccesskey = process.env.SECRET_ACCESS_KEY;

console.log('accessKey', accessKey);
console.log('secretAccesskey', secretAccesskey);
console.log('buckeRegion', buckeRegion);
console.log('bucketName', bucketName);

const imagePath = path.resolve(process.cwd(), 'images/');

(async () => {
  if (fs.existsSync(imagePath)) {
    const files = fs.readdirSync(imagePath);
    const imageFilePromise = files.map((image) => firestoreImageData2(image));
    const results = await Promise.all(imageFilePromise);

    if (!results) process.exit(1);
    for (const result of results) {
      if (!result) continue;
      const s3 = new S3Client({
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretAccesskey,
        },
        region: buckeRegion,
      });

      for (const file of files) {
        const imagePaths = `${imagePath}/${file}`;
        console.log(imagePaths);
        const params = {
          Bucket: bucketName,
          Key: file,
          Body: fs.readFileSync(imagePaths),
          contentType: 'image/png',
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
      }
      process.exit(0);
    }
  } else {
    console.error('Failed to load images...', imagePath);
    process.exit(1);
  }
})();
