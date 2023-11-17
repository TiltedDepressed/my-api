const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Question = require('../models/question')
const checkAuth = require('../middleware/check-auth')

router.post('/questions', checkAuth, (req,res,next) => {
Question.find()
.select("_id question")
.exec()
.then(result => {
    console.log(result)
    res.status(200).json({
        result
    })
})
.catch(err => {
    console.log(err)
    res.status(500).json({
        error: err
    })
})
})

router.post('/questions/random/:count', checkAuth, (req,res,next) => {
     Question.find()
    .select("_id question")
    .exec()
    .then(doc => {
       // const generated = result[Math.floor(Math.random() * result.length)]
        const result = doc.sort( () => Math.random() - Math.random()).slice(0,req.params.count)
        res.status(200).json({
            result
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
    })




router.post('/:questionId', checkAuth, (req,res,next) =>{
    const id = req.params.questionId
    Question.findById(id)
    .select("question")
    .exec()
    .then(result => {
        console.log(result)
        if(result){
            res.status(200).json({
                _id: result._id,
                question: result.question
            })
        } else{
            res.status(404).json({
                message: 'No valid entry found for provided ID'
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err})
    })

})

router.post('/', checkAuth, (req, res, next) => {
   
    const newQuestion = new Question({
        _id: new mongoose.Types.ObjectId(),
        question: req.body.question
    })

    newQuestion.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Question created',
            createdQuestion: newQuestion
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.post('/delete/:questionId', checkAuth, (req,res,next) => {
    const id = req.params.questionId
    Question.findByIdAndRemove(id)
    .exec()
    .then(result => {
        res.status(200).json({
            message: "question deleted"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })

})

router.post('/update/:questionId', checkAuth, (req,res,next)=> {
    const id = req.params.questionId
    Question.findByIdAndUpdate(id, { $set: req.body }, { new: true })
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
})

module.exports = router

