const express = require('express');
const product_model = require('../models/product_model');
const user_model = require('../models/user_model');
const config = require('../config/default.json');
const router = express.Router();

router.post('/',async(req,res)=>{
   console.log(req.body.user);
   if(req.body.temp === "1")
   {
    const rows = await user_model.reportPLUS(parseInt(req.body.user));
   }
   else{
    const rows = await user_model.reportMINUS(parseInt(req.body.user));
   }
  
   res.redirect('/boughtproduct');
})

router.get('/',async(req,res)=>{
    const rows = await product_model.loadBoughtProduct(req.session.authUser.ID);
    const cat1 = await product_model.loadCategories(); 
    res.render('vwProducts/boughtList',{
        bought: rows,
        empty: rows.length === 0,
        categories: cat1,
        emptyCat: cat1.length === 0,
    })
})

module.exports = router;