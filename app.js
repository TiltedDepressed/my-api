require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/user")
const answerRoutes = require("./routes/answer")
const questionRoutes = require("./routes/question")
const resultRoutes = require("./routes/result")
const requestRoutes = require("./routes/request")
const favoritesRoutes = require("./routes/favorites")

mongoose.connect("mongodb+srv://tosltikov52:"+process.env.MONGO_ATLAS_PW+"@node-rest-api.a00tx5j.mongodb.net/?retryWrites=true&w=majority")

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes)
app.use('/answer', answerRoutes)
app.use('/question', questionRoutes)
app.use('/result',resultRoutes)
app.use('/request',requestRoutes)
app.use('/favorites',favoritesRoutes)

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req,res,next) => {
    res.status(error.status || 500)
    res.json({
      error:{
        message: error.message
      }
    })
})


module.exports = app;