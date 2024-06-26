const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req,res,next) => {
User.find()
.select("_id login password role email pin language")
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
                    console.log(err)
                    return res.status(500).json({
                        error:err,
                    })
                } else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        login: req.body.login,
                        password: hash,
                        email:req.body.email,
                        role: req.body.role,
                        pin:req.body.pin,
                        language: req.body.language
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
                expiresIn: "3650h"
            }
            )
            return res.status(200).json({
                message: "Auth successful",
                _id: user[0]._id,
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

router.post('/update/:userId', checkAuth, (req,res,next) => {
    const id = req.params.userId
User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
.exec()
.then(result => {
console.log(result)
res.status(200).json(
    result
    )
})
.catch(err => {
    res.status(500).json({
        error: err
    })
})
});

router.post('/delete/:userId' ,checkAuth, (req, res, next) => {
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

// get user by user id
router.post('/:userId', checkAuth ,   (req, res, next) => {
    const id = req.params.userId
    User.findById(id)
    .exec()
    .then(doc => {
        console.log(doc)
        if(doc) {
            res.status(200).json({
                _id: doc.id,
                login: doc.login,
                role: doc.role,
                email: doc.email,
                pin: doc.pin,
                language: doc.language
                
            });
        } else{
            res.status(404).json({message: 'No valid entry found for provided ID'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({eror:err})
    })
})

router.post('/role/:role', checkAuth, (req, res, next) => {
    const role = req.params.role
    User.find({
        role: role
    })
    .exec()
    .then(result => {
        console.log(result)
        if(result) {
            res.status(200).json({
                result
            });
        } else{
            res.status(404).json({message: 'No valid entry found for provided role'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err})
    })
})

module.exports = router;