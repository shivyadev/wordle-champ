import { Schema, model } from "mongoose";

const GameRecordsSchema = Schema({
    userId: {type: Schema.Types.ObjectId, ref:'User'},
    gameRecord: [[String]],
    word: String,
});

export default model('GameRecords', GameRecordsSchema);