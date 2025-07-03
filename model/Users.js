const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ermad')
.then(() => {  console.log("Connected to MongoDB");})
.catch((error) => { console.error("Error connecting to MongoDB:", error); });

const RegisterSchemea = new mongoose.Schema({
    UserId: {
        type: Number,
        required: true,
        unique: true,
        default: 0
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
});

RegisterSchemea.pre('save', async function (next) {
    if (this.isNew) {
        const lastUser = await mongoose.model("Users").findOne().sort({ UserId: -1 });
        this.UserId = lastUser ? lastUser.UserId + 1 : 1;
    }
    next();
});

const collection = new mongoose.model("Users", RegisterSchemea);
module.exports = collection;