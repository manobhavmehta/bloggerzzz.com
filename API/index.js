const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('./models/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const multer = require('multer');
const uploadmiddleware  = multer({ dest: 'uploads/'});
const fs = require('fs');
const Post = require("./models/Post");
const app=express();

const salt = bcrypt.genSaltSync(10);
const secret = 'kjchwbcnsdjcnduvbsdhnc';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieparser());
app.use('/uploads',express.static(__dirname + '/uploads') );

mongoose.connect('mongodb+srv://manobhavmehta88:Manu2002@cluster0.p1ywwv6.mongodb.net/?retryWrites=true&w=majority'); 

app.post('/register',async (req,res) => {
   const {username,password} = req.body;
   try {
        const userDoc = await User.create({username,
            password:bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
    }
    catch(e)
    {
        res.status(400).json(e);
    }
});

app.post('/login', async (req,res) =>{
    const {username,password} = req.body;
    username.trim();
    const userDoc = await User.findOne({username:username});
    console.log({userDoc});

    if(userDoc===null)
        return res.status(400).json('Wrong Credentials');   
    const passok = bcrypt.compareSync(password,userDoc.password );
    if(passok)
    {
        console.log('here');
        jwt.sign({username,id:userDoc._id},secret,{},(err,token) =>{
            if(err) throw err;
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
        });
    }
    else
    { 
        res.status(400).json('Wrong credentials')
    }
});

app.get('/profile',(req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {},(err,info) =>{
        if(err) throw err;
        res.json(info);
    })
})

app.post('/logout',(req,res) =>{
    res.cookie('token','').json('ok');
})

app.post('/post' , uploadmiddleware.single('file'), async (req,res) => {
    if(!req.file)
    return res.status(400).json('Fill the field');
    const{originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newpath = path+'.'+ext;
    fs.renameSync(path,newpath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) =>{
        if(err) throw err;
        const{title,summary,content} = req.body;
    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newpath,
        author : info.id,
    });
    
    res.json({postDoc});
    
    });
});

app.get('/post' , async (req,res) => {
    const posts = await Post.find().populate('author',['username']).sort({createdAt:-1}).limit(20);
    res.json(posts);
})



app.put('/post', uploadmiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if(req.file)
    {
        const{originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path,newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) =>{
        if(err) throw err;
        const{id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json('You are not the Author');
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        })
        res.json(postDoc);
     });

})


app.get('/post/:id', async (req,res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})

console.log("server is running");
app.listen(4000);
//mongodb+srv://manobhavmehta88:Manu@2002@cluster0.p1ywwv6.mongodb.net/