const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req,res,next) => {
User.find()
.exec()
.then(docs=>{
    console.log(docs)
    res.status(200).json(docs);
})
.catch(err => {
    console.log(err)
    res.status(500).json({
        error: err
    })
})
})

router.post('/signup', (req,res,next)=>{
    User.find({login: req.body.login})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: "login exists"
            })
        } else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error:err
                    })
                } else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        login: req.body.login,
                        password: hash
                    })
                    user
                    .save()
                    .then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: "User created"
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error:err
                        })
                    }) 
                }
            })
        }
        
    })
})

router.post('/login',(req,res,next) => {
    User.find({login: req.body.login})
    .exec()
    .then(user => {
     if(user.length < 1){
        return res.status(401).json({
            message: "Auth failed"
        })
     }
     bcrypt.compare(req.body.password, user[0].password, (err,result) =>{
        if(err){
            return res.status(401).json({
                message: "Auth failed"
            })
        }
        if(result){
          const token =  jwt.sign({
                login: user[0].login,
                userId: user[0]._id
            }, 
            process.env.JWT_KEY, 
            {
                expiresIn: "1h"
            }
            )
            return res.status(200).json({
                message: "Auth successful",
                token: token,
                role: user[0].role
            })
        }
        return res.status(401).json({
            message: "Auth failed"
        })
     })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

router.delete('/:userId' ,checkAuth, (req, res, next) => {
    const id = req.params.userId
    User.findByIdAndRemove(id)
    .exec()
    .then(result => {
        res.status(200).json({
            message: "user deleted"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

module.exports = router;