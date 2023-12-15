const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
dotenv.config();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const imageProcessing = require('./apicall/imageProcessing.js');
const firestoreImageData = require('./apicall/firestoreImageData.js');
const uploadImage = require('./cronjob/cronJob.js');

const app = express();

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/posts', upload.single('image'), async (req, res) => {
  try {
    const ImageData = await firestoreImageData(req);
    if (ImageData) {
      console.log('inside if loop');
      await imageProcessing(req);
      return res.status(201).json({ message: 'Data Inserted in db' });
    } else {
      return res.status(409).json({ message: 'Data already present in db' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

cron.schedule('24 22 14 12 4', () => {
  uploadImage();
});

app.listen(8080, () => console.log('listening on port 8080'));
