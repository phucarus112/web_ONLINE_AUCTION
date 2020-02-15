const express = require('express');
const user_model = require('../../models/user_model');
const router = express.Router();
const restrict = require('../../middlewares/auth.mdw');
const bcrypt = require('bcryptjs');
const moment = require('moment');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

router.get('/',restrict, async(req,res)=>{
   const rows = await user_model.all();
  
   
   res.render('vwUser/user',{
       empty: rows.length === 0,
       userList: rows,
      
   })
});

router.get('/add', restrict,async(req,res)=>{
    const rows2 = await user_model.maxID();
    res.render(`vwUser/add`,{
        idMax: rows2,  
    });
});

router.post('/add',async(req,res)=>{
    const N = 10;
    const hash = bcrypt.hashSync(req.body.txtPass,N);
    const dob = moment(req.body.txtDOB,'DD/MM/YYYY').format('YYYY-MM-DD');
    const entity = {
      ID: parseInt(req.body.txtId) + 1,
      USERNAME: req.body.txtUsername,
      PASSWORD: hash,
      FULLNAME: req.body.txtName,
      EMAIL: req.body.txtEmail,
      DOB: dob,
      PERMISSION : 0,
      POINT_PLUS : 0,
      POINT_SUBSTRACT : 0,
    };  
    console.log(entity);

    const result = await user_model.add(entity);
    res.redirect('/admin/user');
});

router.post('/',async(req,res)=>{
   
   const rows = await user_model.del(parseInt(req.body.txtId));
   res.redirect('/admin/user');
  
});

module.exports = router;