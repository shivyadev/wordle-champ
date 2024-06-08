import { Schema, model } from "mongoose";

const GameRecordsSchema = Schema({
    userId: {type: Schema.Types.ObjectId, ref:'User'},
    gamesCompleted: {type: Number, default: 0},
    gamesWon: {type: Number, default: 0},
    games: {type: [[[String]]], default: []},
});

export default model('GameRecords', GameRecordsSchema);