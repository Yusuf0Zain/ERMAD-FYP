const express = require('express');
const router = express.Router();
const collectionC = require('../model/categories');

router.get('/Categories', async (req, res) => {
  const categories = await collectionC.find().collation({ locale: 'en', strength: 2 }).sort({ Categoryname: 1 });
  res.render('CategoryView', { categories, username: req.session.username });
});
router.post('/Categories', async (req, res) => {
  try {
    const existingCategory = await collectionC.findOne({ Categoryname: req.body.Categoryname });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    await collectionC.create({ Categoryname: req.body.Categoryname });
    res.redirect('/Categories');
  } catch (error) {
    res.status(500).send('An error occurred while adding the category.');
  }
});
router.post('/Categories/delete/:id', async (req, res) => {
  try {
    await collectionC.findByIdAndDelete(req.params.id);
    res.redirect('/Categories');
  } catch (error) {
    res.status(500).send('An error occurred while deleting the category.');
  }
});

module.exports = router;