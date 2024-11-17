const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/crudapp', {
    
}).then(() => {
    console.log("Connected to MongoDB...");
}).catch(err => {
    console.error("Error connecting to MongoDB: ", err);
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    imageurl: String,
    
});

module.exports = mongoose.model('User', userSchema);