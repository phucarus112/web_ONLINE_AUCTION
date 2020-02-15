const express = require('express');
const product_model = require('../models/product_model');
const router = express.Router();

router.get('/',async(req,res)=>{
     const cat1 = await product_model.loadCategories(); 
     res.render('vwOther/faq',{
          categories: cat1,
            emptyCat: cat1.length === 0,
     });
})

router.post('/',async(req,res)=>{
  
  
});

module.exports = router;