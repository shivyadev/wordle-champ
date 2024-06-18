const mongoose = require('mongoose');

const GameRecordsSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    gameRecord: [[String]],
    word: String,
});

module.exports = mongoose.model('GameRecords', GameRecordsSchema);