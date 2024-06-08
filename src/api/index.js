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
        
        await GameRecords.create({
            userId: createdUser._id,
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

app.get('/gamerecord/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const gameRecord = await GameRecords.findOne({userId: id});
        res.json(gameRecord);
    }catch(err){
        console.error('here',err);
    }
})

app.post('/storegame', async (req, res) => {
    const {userId, guessedWords, won} = req.body;
    
    try{
        const gameRecord = await GameRecords.findOne({userId});
        gameRecord.games.length = 0;
        gameRecord.gamesCompleted += 1;
        if(won) {
            gameRecord.gamesWon += 1;
        }
        await gameRecord.save();
    }catch(err){
        console.error(err)
    }
})

app.post('/logout', (req,res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json(true);
})

app.listen(5000);
