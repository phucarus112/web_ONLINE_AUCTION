const express = require('express');
const product_model = require('../models/product_model');
const config = require('../config/default.json');
const router = express.Router();

router.post('/',async(req,res)=>{
   
})

router.get('/',async(req,res)=>{
    const rows = await product_model.loadSellingProduct(req.session.authUser.ID);
    const cat1 = await product_model.loadCategories(); 
    res.render('vwProducts/sellingList',{
        selling: rows,
        empty: rows.length === 0,
        categories: cat1,
        emptyCat: cat1.length === 0,
    })
})

module.exports = router;