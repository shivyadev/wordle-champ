/* eslint-disable no-undef */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from './models/User.js';
import GameRecords from "./models/GameRecords.js";
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
}))
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL);

const bcryptSalt = bcrypt.genSaltSync(10);

function refreshToken(req, res, next) {
    const {refreshToken} = req.cookies;
    jwt.verify(refreshToken, process.env.Refresh_Token_Secret, (err, data) => {
        jwt.sign({id: data.id}, process.env.Access_Token_Secret, {expiresIn:'15s'}, (err, token) => {
            if(err) throw err;
            res.cookie('accessToken', token);
            req.cookies.accessToken = token;
            next();
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    
    const {accessToken} = req.cookies;

    jwt.verify(accessToken, process.env.Access_Token_Secret, (err) => {
        if(err) {
            if(err.name === 'TokenExpiredError'){
                return refreshToken(req, res, next);      
            }else{
                throw err;
            }
        }else{
            next();
        }
    })
}

app.get('/', (req,res) => {
    res.json('Hello');
})

app.post('/register', async (req,res) => {
    const {name, mail, password} = req.body;
    const encryptedPwd = bcrypt.hashSync(password,bcryptSalt);

    const email = !mail.includes("@gmail.com") ? mail.concat("@gmail.com") : mail; 

    try {
        const createdUser = await User.create({
            name,
            mail: email,
            password: encryptedPwd,
        });

        res.json(createdUser);

    }catch (err){
        console.error(err);
    }
})

app.post('/login', async (req,res) => {
    const { mail, password} = req.body;

    try {
        const userDoc = await User.findOne({mail});
        const cmpPwd = bcrypt.compareSync(password, userDoc.password);

        if(cmpPwd) {
            const accessToken = jwt.sign({id: userDoc._id}, process.env.Access_Token_Secret, {expiresIn: '15s'});
            const refreshToken = jwt.sign({id: userDoc._id}, process.env.Refresh_Token_Secret, {expiresIn: '7d'});

            res.cookie('accessToken', accessToken);
            res.cookie('refreshToken', refreshToken);
            res.json(userDoc);
        }
        
    } catch (err) {
        console.error(err);
    }

})

app.get('/profile', verifyAccessToken, (req,res) => {

    const {accessToken} = req.cookies;
    
    if(accessToken) {
        jwt.verify(accessToken, process.env.Access_Token_Secret, async (err, user) => {
            if(err) throw err;
            const userDoc = await User.findById(user.id);
            res.json(userDoc);
        })
    }else {
        res.status(401).json('Unauthorized');
    }
})

app.get('/profile/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const profileInfo = await User.findById(id);
        res.json(profileInfo);
    }catch(err){
        console.error(err);
    }
})

app.get('/gamerecord/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const gameRecord = await GameRecords.find({userId: id});
        gameRecord.reverse();
        if(gameRecord.length > 4) gameRecord.length = 4;
        
        const userRecord = await User.findById(id);
        res.json([gameRecord, userRecord]);
    }catch(err){
        console.error(err);
    }
})

app.post('/storegame', async (req, res) => {
    const {userId, guessedWords, won, targetWord} = req.body;
    
    try{
        
        const userRecord = await User.findById(userId);
        userRecord.gamesCompleted += 1;
        if(won) {
            userRecord.gamesWon += 1;
        }

        await userRecord.save();

        await GameRecords.create({
            userId,
            gameRecord: guessedWords,
            word: targetWord,
        })

    }catch(err){
        console.error(err)
    }
})

app.get('/search', async (req,res) => {
    const searchValue = req.query.name;
    try{
        const userList = await User.find({name: {$regex: searchValue, $options: 'i'}});
        res.json(userList);
    }catch(err){
        console.error(err);
    }
    
})

app.post('/logout', (req,res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json(true);
})

app.listen(5000);
