const express = require('express');
const product_model = require('../models/product_model');
const config = require('../config/default.json');
const router = express.Router();

router.get('/',async(req,res)=>{
    const cat1 = await product_model.loadCategories(); 
    const rows = await product_model.loadWonProduct(req.session.authUser.ID);
    res.render('vwProducts/wonList',{
        wonlist: rows,
        empty: rows.length === 0,
        categories: cat1,
        emptyCat: cat1.length === 0,
    })
})

module.exports = router;