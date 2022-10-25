const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// Setup the congifuration needed to use multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
});

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

module.exports = router;
