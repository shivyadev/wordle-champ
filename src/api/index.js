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
import axios from "axios";
const app = express();

dotenv.config({ path: '../../.env'});

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'https://random-word-api.herokuapp.com']
}))
app.use(cookieParser());

mongoose.connect(process.env.VITE_MONGO_URL);

const bcryptSalt = bcrypt.genSaltSync(10);

function generateAccessToken(data) {
    return jwt.sign({data}, process.env.VITE_ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
}

function generateRefreshToken(data) {
    return jwt.sign({data}, process.env.VITE_REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
}


const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.VITE_ACCESS_TOKEN_SECRET, (err, data) => {
        if(err) {
            console.log('error here');
            return res.sendStatus(403);
        }
        req.userId = data.data; 
        next();
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

        const refreshToken = generateRefreshToken({id: userDoc._id});
        const accessToken = generateAccessToken({id: userDoc._id});

        if(cmpPwd) {
            res.cookie('refreshToken', refreshToken, {
                "httpOnly": true,
                "secure": true,
                "sameSite": 'Strict', 
            }).json(accessToken);
        }

    } catch (err) {
        console.error(err);
    }

})

app.get('/refresh-token', (req, res) => {
    const {refreshToken} = req.cookies;
    
    if(!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.VITE_REFRESH_TOKEN_SECRET, (err, data) => {
        if(err) return res.sendStatus(403);
        const newAccessToken = generateAccessToken(data.data.id);
        res.json(newAccessToken);
    })
})

app.get('/profile', verifyAccessToken, async (req,res) => {       
    try{
        let id;
        if (typeof req.userId === 'object' && req.userId !== null) {
            id = req.userId.id; 
        } else {
            id = req.userId; 
        }
        const userDoc = await User.findById(id);
        console.log(userDoc);
        res.json(userDoc);
    }catch {
        res.sendStatus(404);
    }
})

app.get('/profile/:id', verifyAccessToken, async (req, res) => {
    const {id} = req.params;
    try{
        const profileInfo = await User.findById(id);
        const gameRecord = await GameRecords.find({userId: id});
        gameRecord.reverse();
        if(gameRecord.length > 4) gameRecord.length = 4;        
        res.json([profileInfo, gameRecord]);
    }catch(err){
        console.error(err);
    }
})

app.put('/addimage/:id', verifyAccessToken, async (req, res) => {
    const {id} = req.params;
    const {imageUrl , name} = req.body;

    try{
        const userRecord = await User.findById(id);
        userRecord.name = name;   
        if(imageUrl !== "") 
            userRecord.imageUrl = imageUrl;
        await userRecord.save();

        res.json(userRecord);
    }catch(err){
        console.error(err);
    }
})

app.get('/gamerecord/:id', verifyAccessToken,  async (req, res) => {
    const {id} = req.params;
    try{
        const gameRecord = await GameRecords.find({userId: id});
        gameRecord.reverse();
        if(gameRecord.length > 4) gameRecord.length = 4;
        
        const userRecord = await User.findById(id);
        res.json([gameRecord, userRecord]);
    }catch(err){
        res.sendStatus(404);
    }
})

app.get('/getword', async (req, res) => {
    try{
        const {data} = await axios.get('https://random-word-api.herokuapp.com/word?length=5');      
        res.json(data[0]);      
    }catch(err){
        console.error(err);
    }
})

app.post('/storegame', verifyAccessToken, async (req, res) => {
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

app.put('/addfriend', verifyAccessToken, async (req, res) => {
    const {userId, friendId} = req.body;
    try{
        const userRecord = await User.findById(userId);
        userRecord.friendsList.push(friendId);
        userRecord.save();

        res.json(userRecord);
    }catch(err){
        console.error(err);
    }
})

app.put('/removefriend', verifyAccessToken, async (req,res) => {
    const {userId, friendId} = req.body;
    try{
        const userRecord = await User.findById(userId);
        const newFriendList = userRecord.friendsList.filter(id => {
            return id.toString() !== friendId;
        })
        userRecord.friendsList = newFriendList;
        userRecord.save();
        const result = [];
        for(let i in userRecord.friendsList){
            result.push(await User.findById(userRecord.friendsList[i]));
        }
        res.json([result, userRecord]);
    }catch(err){
        console.error(err);
    }
})

app.get('/friendslist/:id', verifyAccessToken, async (req,res) => {
    const {id} = req.params;
    const {friendsList} = await User.findById(id);
    const result = [];
    for(let i in friendsList){
        result.push(await User.findById(friendsList[i]));
    }
    res.json(result);
})

app.get('/search', verifyAccessToken, async (req,res) => {
    const searchValue = req.query.name;
    try{
        const userList = await User.find({name: {$regex: searchValue, $options: 'i'}});
        res.json(userList);
    }catch(err){
        console.error(err);
    }
    
})

app.post('/logout', (req,res) => {
    res.clearCookie('refreshToken');
    res.json(true);
})

app.listen(5000);
