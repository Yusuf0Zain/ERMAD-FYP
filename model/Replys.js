const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ermad')



const RepSchemea = new mongoose.Schema({
    Reply: {
        type: String,
        required: true
    },
    ReplyDate: {
        type: Date,
        default: Date.now
    },
    ReplyBy: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
});

const collectionR = new mongoose.model("Replys", RepSchemea);

module.exports = collectionR;