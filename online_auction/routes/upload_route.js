const express = require('express');
const mysql = require('mysql');
const router = express.Router();
router.use(express.static('public'));
const db = require('../utils/db');
const model = require('../models/categories_model');
const fs = require('fs');
const multer = require('multer');
var moment = require('moment');
const restrict = require('../middlewares/auth.mdw');

router.post('/',async(req,res)=>{
    let current = moment();

  fs.mkdir('./public/imgs/sp/undefined', { recursive: true }, (err) => {
    if (err) throw err;
  }); 
  const storage = multer.diskStorage({
    filename: function(req,file,cb){
      cb(null,file.originalname)
    },

    destination: function(req,file,cb){
      cb(null,'./public/imgs/sp/undefined')
    }
  });

  const upload = multer({storage});
  upload.array('file',10)(req,res,err => {
    if(err){}
    const entity =  {
      ID: parseInt(req.body.txtId) + 1,
      NAME: req.body.txtName,
      DESCRIPTION: req.body.txtDes,
      ORIGINAL_PRICE: parseInt(req.body.txtPrice),
      PRICE: parseInt(req.body.txtPrice),
      STATUS: 0,
      DAYSTART:current.format('YYYY-MM-DD hh:mm:ss'),
      DAYEND: current.add(7, 'days').format('YYYY-MM-DD hh:mm:ss'),
      SELLER: req.session.authUser.ID,
      TURN_AUCTION: 0,
      BUOCGIA: parseInt(req.body.txtBuocGia),
      CATEGORIES: parseInt(req.body.idCat),
      BIDDER: -1
    }
    console.log(entity);
    const result =  model.add(entity);

    fs.rename('./public/imgs/sp/undefined', './public/imgs/sp/' + (parseInt(req.body.txtId)+1).toString(), function (err) {
      if (err) console.log('ERROR: ' + err);
    });

    let listFilename = [];
    for (let i = 0; i < req.files.length; i++) {
        listFilename[i] = req.files[i].filename;
    }
    console.log(listFilename);
    for(let i = 0; i<= req.files.length;i++)
    {
      if(i===0)
      {
        fs.rename('./public/imgs/sp/'+(parseInt(req.body.txtId)+1).toString() +'/'+ listFilename[i],
        './public/imgs/sp/'+ (parseInt(req.body.txtId)+1).toString() + '/main_thumb.jpg', function (err) {
          if (err) console.log('ERROR: ' + err);
        });
      } 
    else
    {
      fs.rename('./public/imgs/sp/'+(parseInt(req.body.txtId)+1).toString() +'/'+ listFilename[i],
      './public/imgs/sp/'+ (parseInt(req.body.txtId)+1).toString() +'/'+ i.toString() +'_thumb.jpg', function (err) {
        if (err) console.log('ERROR: ' + err);
      });
    }
  }
  res.redirect('/'); 
});
});

router.get('/',restrict,async(req,res)=>{
    const rows = await model.maxID();
    const cat = await model.loadCategories();
    
    res.render('vwCategories/add',{
        idMax: rows,
        categories: cat,
    });
});

module.exports = router;