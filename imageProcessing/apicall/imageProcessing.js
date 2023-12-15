const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const bucketName = process.env.BUCKET_NAME;
const buckeRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccesskey = process.env.SECRET_ACCESS_KEY;

const imageProcessing = async (req) => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretAccesskey,
    },
    region: buckeRegion,
  });
  const params = {
    Bucket: bucketName,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);
};

module.exports = imageProcessing;
