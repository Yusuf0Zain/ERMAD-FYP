const express = require('express');
const router = express.Router();
const collectionP = require('../model/Posts');
const collectionC = require('../model/categories');
const collectionR = require('../model/Replys');

router.get('/PostsLists', async (req, res) => {
  const sort = req.query.sort || 'date';
  let posts = await collectionP.find();
  if (sort === 'alphabetic') {
    posts = posts.sort((a, b) => (a.Title || '').localeCompare(b.Title || ''));
  } else if (sort === 'category') {
    posts = posts.sort((a, b) => (a.Category || '').localeCompare(b.Category || ''));
  } else if (sort === 'date') {
    posts = posts.sort((a, b) => {
      const dateA = a.createdAt || a._id.getTimestamp();
      const dateB = b.createdAt || b._id.getTimestamp();
      return dateB - dateA;
    });
  }
  res.render('managePostView', { posts, sort, username: req.session.username });
});
router.post('/Posts/delete/:id', async (req, res) => {
  try {
    await collectionP.findByIdAndDelete(req.params.id);
    res.redirect('/PostsLists');
  } catch (error) {
    res.status(500).send('An error occurred while deleting the post.');
  }
});

router.get('/Discussions', async (req, res) => {
  const sort = req.query.sort || 'category';
  let posts = await collectionP.find();
  let grouped = {};
  if (sort === 'alphabetic') {
    posts.forEach(post => {
      const letter = post.Title ? post.Title[0].toUpperCase() : '#';
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(post);
    });
    grouped = Object.fromEntries(Object.entries(grouped).sort());
  } else if (sort === 'category') {
    posts.forEach(post => {
      const cat = post.Category || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(post);
    });
    grouped = Object.fromEntries(Object.entries(grouped).sort());
  }
  res.render('DiscussionView', { grouped, username: req.session.username, sort });
});

router.get('/Create', async (req, res) => {
  const categories = await collectionC.find().collation({ locale: 'en', strength: 2 }).sort({ Categoryname: 1 });
  res.render('CreatePostView', { categories });
});
router.post('/Create', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).send('You must be logged in to create a post.');
    await collectionP.create({
      Title: req.body.Title,
      Description: req.body.Description,
      Category: req.body.Category,
      UploadedBy: username,
    });
    res.redirect('/Discussions');
  } catch (error) {
    res.status(500).send('An error occurred during file upload.');
  }
});

router.get('/view/:id', async (req, res) => {
  try {
    const post = await collectionP.findById(req.params.id);
    const replies = await collectionR.find({ postId: post._id });
    if (!post) return res.status(404).send('Post not found');
    res.render('PostDetailsView', { post, username: req.session.username, replies });
  } catch (error) {
    res.status(500).send('An error occurred while fetching the post.');
  }
});

module.exports = router;