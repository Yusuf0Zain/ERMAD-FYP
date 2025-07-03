const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ermad')


const CategorySchemea = new mongoose.Schema({
    CategoryID: {
        type: Number,
        required: true,
        unique: true,
        default: 0
    },
    Categoryname: {
        type: String,
        required: true
    }
});

CategorySchemea.pre('save', async function (next) {
    if (this.isNew) {
        const lastCategory = await mongoose.model("Categories").findOne().sort({ CategoryID: -1 });
        this.CategoryID = lastCategory ? lastCategory.CategoryID + 1 : 1;
   }
    next();
});

const collectionC = new mongoose.model("Categories", CategorySchemea);

module.exports = collectionC;