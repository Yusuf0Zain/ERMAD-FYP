const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ermad')

const PosSchemea = new mongoose.Schema({

    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    UploadDate: {
        type: Date,
        default: Date.now
    },
    UploadedBy: {
        type: String,
        required: true
    },

});

const collectionP = new mongoose.model("Posts", PosSchemea);

module.exports = collectionP;