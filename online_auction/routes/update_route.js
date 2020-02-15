const express = require('express');
const user_model = require('../models/user_model');
const product_model = require('../models/product_model');
const config = require('../config/default.json');
const router = express.Router();
const restrict = require('../middlewares/auth.mdw');

router.post('/',async(req,res)=>{
   const rows = await user_model.sendUpdateAcc(req.session.authUser.ID);
   res.redirect('/');
})

router.get('/',restrict, async(req,res)=>{
    const rows = await user_model.getUpdateAcc(req.session.authUser.ID);
    const cat1 = await product_model.loadCategories(); 
    res.render('vwAccount/update',{
        yes: rows[0].PERMISSION === -1,
        categories: cat1,
        emptyCat: cat1.length === 0,
    });
})

module.exports = router;