const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        minLength: 3,
        maxLength: 15
    },
    email: {
        type: String,
        required: [true, "Last name is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, "Password is required"],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    image: {
        type: String,
        required: false
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: false
    }]

}, {timestamps: {createdAt: 'created_at', updatedAt: false}});
const User = mongoose.model('User', userSchema);

module.exports = User;
