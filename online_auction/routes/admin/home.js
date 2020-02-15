const express = require('express');
const mysql = require('mysql');
const router = express.Router();
router.use(express.static('public'));
const db = require('../../utils/db');
const model = require('../../models/categories_model');
const config = require('../../config/default.json');
const fs = require('fs');
const multer = require('multer');
var moment = require('moment');

router.get('/', async(req,res)=>{

    const rows = await model.all();
    const rows2 = await model.recentlyPro();
    if(rows.length ==0)
    {
      throw new Error('ERROR');
    }
      res.render('vwCategories/categories',{
        categories: rows,
        empty: rows.length === 0,
        recently: rows2,
      });
});

router.get('/:id', async(req,res)=>{
  const rows = await model.single(req.params.id);
  if(rows.length ==0)
  {
    throw new Error('Invalid ID');
  }
    res.render('vwCategories/edit',{
      categories: rows[0]
    });
});

router.post('/patch',async(req,res)=>{
  const entity = {
    ID: req.body.txtId,
    NAME: req.body.txtName,
    PRICE: req.body.txtPrice,
    BUOCGIA: req.body.txtBuocGia
  }
  console.log(entity);
  const result = await model.patch(entity);
  
  res.redirect('/admin/home');
});

router.post('/del',async(req,res)=>{
  const result = await model.del(req.body.txtId);
  console.log(req.body.txtId);
  res.redirect('/admin/home');
});

module.exports = router;