import { Schema , model} from 'mongoose';

const userSchema = Schema({
    name: {type: String, required: true},
    mail: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    gamesCompleted: {type: Number, default: 0},
    gamesWon: {type: Number, default: 0},
})

const userModel = model('User', userSchema);

export default userModel;