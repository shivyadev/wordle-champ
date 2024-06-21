/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/User'); 
const GameRecords = require('./models/GameRecords');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {v4} = require('uuid');
const axios = require('axios');

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'https://random-word-api.herokuapp.com']
}))
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL);

const bcryptSalt = bcrypt.genSaltSync(10);


const generateAccessToken = (data) => {
    return jwt.sign({data, randId: v4()}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
}

const generateRefreshToken = (data) => {
    return jwt.sign({data, randId: v4()}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
}

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Access token has expired' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Access token is invalid' });
            }
            return res.sendStatus(403);
        }
        req.userId = user.data;
        next();
    });
}

app.get('/', (req,res) => {
    res.json('Hello');
})

app.get('/refresh-token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(401);
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const newAccessToken = generateAccessToken(user.data.id);
        res.json(newAccessToken);
    });
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
            const accessToken = generateAccessToken({id: userDoc._id});
            const refreshToken = generateRefreshToken({id: userDoc._id});

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });

            res.json(accessToken);
        }
        
    } catch (err) {
        console.error(err);
    }

})

app.get('/profile', verifyAccessToken, async (req,res) => {

    try {

        let id;
        if (typeof req.userId === 'object' && req.userId !== null) {
            id = req.userId.id; // Assuming req.userId is an object with an 'id' property
        } else {
            id = req.userId; // Assuming req.userId is not an object
        }

        const userDoc = await User.findById(id);
        
        if (!userDoc) {
            return res.sendStatus(404);
        }
        
        res.json(userDoc);
    } catch (error) {
        res.sendStatus(500); // Server error status
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

app.get('/gamerecord/:id', verifyAccessToken, async (req, res) => {
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

app.get('/getword', async (req, res) => {
    try{
        const {data} = await axios.get('https://random-word-api.herokuapp.com/word?length=5');      
        res.json(data[0]);      
    }catch(err){
        console.error(err);
    }
})

app.put('/storegame', verifyAccessToken, async (req, res) => {
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
        if(result.length > 6) result.length = 6;
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
    if(result.length > 6){
        result.length = 6;
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

app.get('/delete', async (req,res) => {
    await GameRecords.deleteMany();
    res.json('deleted');
})

app.post('/logout', (req,res) => {
    res.clearCookie('refreshToken');
    res.json(true);
})

app.listen(5000);
