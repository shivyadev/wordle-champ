const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    mail: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    gamesCompleted: {type: Number, default: 0},
    gamesWon: {type: Number, default: 0},
    friendsList: {type: [mongoose.Schema.Types.ObjectId]},
    imageUrl: {type: String, default:""},
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;