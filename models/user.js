var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: { type: String, required: true },
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('User', userSchema);