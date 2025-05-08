const mongoose = require('mongoose');
const bcrypt = require ('bcrypt');

//User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    account_created: {
        type: Date,
        default: Date.now
    }
});
