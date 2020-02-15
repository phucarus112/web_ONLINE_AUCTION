const express = require('express');
const product_model = require('../models/product_model');
const config = require('../config/default.json');
const router = express.Router();

router.post('/',async(req,res)=>{
    console.log(req.body.txtId);
    const rows = await product_model.removeLoveProduct(req.session.authUser.ID,req.body.txtId);
    res.redirect('/watchlist'); 
})

router.get('/',async(req,res)=>{
    const rows = await product_model.loadLoveProduct(req.session.authUser.ID);
    const cat1 = await product_model.loadCategories(); 
    res.render('vwProducts/watchList',{
        lovelist: rows,
        empty: rows.length === 0,
        categories: cat1,
        emptyCat: cat1.length === 0,
    })
})

module.exports = router;