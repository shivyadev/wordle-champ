import { Schema , model} from 'mongoose';

const userSchema = Schema({
    name: {type: String, required: true},
    mail: {type: String, required: true, unique: true},
    password: {type: String, required: true},
})

const userModel = model('User', userSchema);

export default userModel;