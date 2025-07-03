const express = require('express');
const router = express.Router();
const collectionR = require('../model/Replys');

router.post('/reply/:postId', async (req, res) => {
  try {
    const username = req.session.username;
    await collectionR.create({
      Reply: req.body.Reply,
      ReplyBy: username,
      postId: req.params.postId
    });
    res.redirect('/view/' + req.params.postId);
  } catch (error) {
    res.status(500).send('An error occurred while saving the reply.');
  }
});

module.exports = router;