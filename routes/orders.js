
   const express = require('express');
   const router = express.Router();
   const mongoose = require('mongoose');

   const Order = require('../models/order')
   const Product = require("../models/product");


   router.get('/', (req,res,next) => {
   Order
   .find()
   .select("_id product")
   .exec()
   .then(docs => {
      res.status(200).json(docs)
   })
   .catch(err => {
      res.status(500).json({
         error:err
      })
   })
});
   router.post('/', (req,res,next) => {
      Product.findById(req.body.productId)
      .then(product => {
       return  order
         .save()
         .exec()
         .then(result => {
            console.log(result);
            res.status(201).json(result)  
         })
         .catch(err => {
            console.log(err);
            res.status(500).json({
               error: err
            })
         });
      })
      .catch(err => {
         res.status(500).json({
            message: 'Product not found',
            error: err
         })
      })
      const order = new Order({
         _id: new mongoose.Types.ObjectId(),
         product: req.body.productId
      });

    });
   
    router.get('/:orderId', (req,res,next) => {
   res.status(200).json({
   message: "Orders details",
   orderId: req.params.orderId 
        })
        });
   
    router.delete('/:orderId', (req,res,next) => {
   res.status(200).json({
   message: "Orders deleted",
   orderId: req.params.orderId 
            })
            });
   module.exports = router;