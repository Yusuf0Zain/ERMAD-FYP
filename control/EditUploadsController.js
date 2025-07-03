const express = require('express');
const router = express.Router();
const collectionF = require('../model/Files');
const collectionP = require('../model/Posts');
const collectionC = require('../model/categories');




router.get('/EditUploads', async (req, res) => {
  const files = await collectionF.find({ uploadedBy: req.session.username });
  const posts = await collectionP.find({ UploadedBy: req.session.username });
  res.render('EditUploadsView', { files, posts });
});

router.post('/delete/file/:id', async (req, res) => {
  try {
    await collectionF.findByIdAndDelete(req.params.id);
    res.redirect('/EditUploads');
  } catch (error) {
    res.status(500).send('An error occurred while deleting the file.');
  }
});


router.post('/delete/post/:id', async (req, res) => {
  try {
    await collectionP.findByIdAndDelete(req.params.id);
    res.redirect('/EditUploads');
  } catch (error) {
    res.status(500).send('An error occurred while deleting the post.');
  }
});

router.get('/edit/file/:id', async (req, res) => {
  try {
    const file = await collectionF.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');
    const categories = await collectionC.find().collation({ locale: 'en', strength: 2 }).sort({ Categoryname: 1 });
    res.render('EditView', { file, categories, username: req.session.username, type: 'file' });
  } catch (error) {
    res.status(500).send('An error occurred while fetching the file.');
  }
});

router.post('/edit/file/:id', async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      Category: req.body.Category
    };
    await collectionF.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/EditUploads');
  } catch (error) {
    res.status(500).send('An error occurred while updating the file.');
  }
});

router.get('/edit/post/:id', async (req, res) => {
  try {
    const post = await collectionP.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    const categories = await collectionC.find().collation({ locale: 'en', strength: 2 }).sort({ Categoryname: 1 });
    res.render('EditView', { post, categories, username: req.session.username, type: 'post' });
  } catch (error) {
    res.status(500).send('An error occurred while fetching the post.');
  }
});

router.post('/edit/post/:id', async (req, res) => {
  try {
    const updateData = {
      Title: req.body.Title,
      Description: req.body.Description,
      Category: req.body.Category
    };
    await collectionP.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/EditUploads');
  } catch (error) {
    res.status(500).send('An error occurred while updating the post.');
  }
});

module.exports = router;