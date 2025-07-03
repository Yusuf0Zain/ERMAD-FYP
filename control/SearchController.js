const express = require('express');
const router = express.Router();
const Fuse = require('fuse.js');
const collectionP = require('../model/Posts');
const collectionF = require('../model/Files');
const collectionC = require('../model/categories');

router.get('/search', async (req, res) => {
  const query = req.query.q || '';
  const selectedCategory = req.query.category || '';
  let allPosts = await collectionP.find();
  let allMaterials = await collectionF.find({ status: 'accepted' });
  if (selectedCategory) {
    allPosts = allPosts.filter(post => post.Category === selectedCategory);
  }
  let posts = allPosts;
  if (query) {
    const fusePosts = new Fuse(allPosts, { keys: ['Title', 'Description'], threshold: 0.4 });
    posts = fusePosts.search(query).map(r => r.item);
  }
  let materials = allMaterials;
  if (query) {
    const fuseMaterials = new Fuse(allMaterials, { keys: ['title', 'description', 'Category'], threshold: 0.4 });
    materials = fuseMaterials.search(query).map(r => r.item);
  }
  const categories = await collectionC.find().collation({ locale: 'en', strength: 2 }).sort({ Categoryname: 1 });
  res.render('SearchResultView', { posts, materials, categories, query, selectedCategory, username: req.session.username });
});

module.exports = router;