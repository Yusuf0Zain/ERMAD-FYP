const express = require('express');
const router = express.Router();
const collectionF = require('../model/Files');
const collectionC = require('../model/categories');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
function fileFilter(req, file, cb) {
  const allowedTypes = ['.pdf', '.zip'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and ZIP files are allowed!'), false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });


router.get('/Upload', async (req, res) => {
  const categories = await collectionC.find().collation({ locale: 'en', strength: 2 }).sort({ Categoryname: 1 });
  res.render('UploadView', { categories });
});
router.post('/Upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded.');
    await collectionF.create({
      title: req.body.title,
      description: req.body.description,
      file: req.file.filename,
      Category: req.body.Category,
      uploadedBy: req.session.username,
      status: 'verifying'
    });
    res.redirect('/Materials');
  } catch (error) {
    res.status(500).send('An error occurred during file upload.');
  }
});

router.get('/Materials', async (req, res) => {
  const sort = req.query.sort || 'category';
  let Files = await collectionF.find();
  let grouped = {};
  if (sort === 'alphabetic') {
    Files.forEach(file => {
      const letter = file.Title ? file.Title[0].toUpperCase() : '#';
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(file);
    });
    grouped = Object.fromEntries(Object.entries(grouped).sort());
  } else if (sort === 'category') {
    Files.forEach(Files => {
      const cat = Files.Category || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(Files);
    });
    grouped = Object.fromEntries(Object.entries(grouped).sort());
  }
  res.render('AllMaterialsView', { grouped, username: req.session.username, sort });
});

router.get('/MyMaterials', async (req, res) => {
  const files = await collectionF.find({ uploadedBy: req.session.username });
  res.render('MyMaterialsView', { files });
});

router.get('/FilesLists', async (req, res) => {
  const sort = req.query.sort || 'date';
  let files = await collectionF.find();
  if (sort === 'alphabetic') {
    files = files.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else if (sort === 'category') {
    files = files.sort((a, b) => (a.Category || '').localeCompare(b.Category || ''));
  } else if (sort === 'date') {
    files = files.sort((a, b) => {
      const dateA = a.createdAt || a._id.getTimestamp();
      const dateB = b.createdAt || b._id.getTimestamp();
      return dateB - dateA;
    });
  }
  res.render('manageFileView', { files, sort });
});
router.post('/FilesLists/delete/:id', async (req, res) => {
  try {
    await collectionF.findByIdAndDelete(req.params.id);
    res.redirect('/FilesLists');
  } catch (error) {
    res.status(500).send('An error occurred while deleting the file.');
  }
});

router.get('/viewFile/:id', async (req, res) => {
  try {
    const file = await collectionF.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');
    res.render('FileDetailsView', { file, username: req.session.username });
  } catch (error) {
    res.status(500).send('An error occurred while fetching the file.');
  }
});

router.get('/verifications', async (req, res) => {
  const sort = req.query.sort || 'date';
  let files = await collectionF.find({ status: 'verifying' });
  if (sort === 'alphabetic') {
    files = files.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else if (sort === 'category') {
    files = files.sort((a, b) => (a.Category || '').localeCompare(b.Category || ''));
  } else if (sort === 'date') {
    files = files.sort((a, b) => {
      const dateA = a.createdAt || a._id.getTimestamp();
      const dateB = b.createdAt || b._id.getTimestamp();
      return dateB - dateA;
    });
  }
  res.render('Verification', { files, sort });
});
router.post('/verifications/accept/:id', async (req, res) => {
  await collectionF.findByIdAndUpdate(req.params.id, { status: 'accepted' });
  res.redirect('/verifications');
});
router.post('/verifications/decline/:id', async (req, res) => {
  await collectionF.findByIdAndUpdate(req.params.id, { status: 'declined' });
  res.redirect('/verifications');
});

module.exports = router;