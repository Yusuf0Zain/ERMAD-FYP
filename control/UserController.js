const express = require('express');
const router = express.Router();
const collection = require('../model/Users');

router.get('/Userlists', async (req, res) => {
  res.render('ManageUserView', { users: await collection.find() });
});
router.post('/Userlists/delete/:id', async (req, res) => {
  try {
    await collection.findByIdAndDelete(req.params.id);
    res.redirect('/Userlists');
  } catch (error) {
    res.status(500).send('An error occurred while deleting the user.');
  }
});

module.exports = router;