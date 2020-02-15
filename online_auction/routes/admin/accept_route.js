const express = require('express');
const user_model = require('../../models/user_model');
const router = express.Router();
const restrict = require('../../middlewares/auth.mdw');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

router.post('/',async(req,res)=>{
  
  if(req.body.temp === "1")
  {
    const rows = await user_model.acceptRequire(parseInt(req.body.txtId));
  }
  else if(req.body.temp === "2"){
    const rows = await user_model.rejectRequire(parseInt(req.body.txtId));
  }
  else{
    const rows = await user_model.downLevel(parseInt(req.body.txtId2));
  }
  
  res.redirect('/admin/acceptAccount');
})

router.get('/',restrict, async(req,res)=>{
   
    const rows = await user_model.loadRequireList();
    const rows2 = await user_model.loadUser();
    res.render('vwAccount/accept',{
        requireList: rows,
        empty: rows.length === 0,
        seller: rows2,
        emptySeller: rows2.length === 0,
    });
})

module.exports = router;