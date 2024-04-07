import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from './models/User.js';
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
}))

mongoose.connect(process.env.MONGO_URL);

const bcryptSalt = bcrypt.genSaltSync(10);

app.get('/', (req,res) => {
    res.json('5000');
})

app.post('/register', async (req,res) => {
    const {name, mail, password} = req.body;
    const encryptedPwd = bcrypt.hashSync(password,bcryptSalt);

    const email = !mail.includes("@gmail.com") ? mail.concat("@gmail.com") : mail; 

    try {
        await User.create({
            name,
            mail: email,
            password: encryptedPwd,
        })
        res.json('UserCreated');
    }catch (err){
        console.error(err);
    }
})

app.post('/login', async (req,res) => {
    const { mail, password} = req.body;

    try {
        const userDoc = await User.findOne({mail});
        const cmpPwd = bcrypt.compareSync(password, userDoc.password);

        if(cmpPwd) res.json('User Logged In');
    } catch (err) {
        console.error(err);
    }

})

app.listen(5000);
