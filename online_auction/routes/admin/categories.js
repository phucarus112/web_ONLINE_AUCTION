const express = require('express');
const model = require('../../models/categories_model');
const router = express.Router();
const restrict = require('../../middlewares/auth.mdw');

router.get('/',restrict, async(req,res)=>{
    const rows = await model.loadCategories();
    res.render('vwCategories/nameCat',{
        empty: rows.length === 0,
        nameCat: rows,
    })
 });

 router.get('/add', restrict,async(req,res)=>{
    const rows2 = await model.maxIDCat();
   
    res.render(`vwCategories/addNewCat`,{
        idMax: rows2,  
    });
});

router.get('/:id', restrict,async(req,res)=>{
    console.log(req.body.txtId);
    const rows2 = await model.singleCat(req.params.id);
   
    res.render(`vwCategories/editNameCat`,{
        cat: rows2[0],
    });
});


router.post('/add',async(req,res)=>{
    const entity = {
        ID: parseInt(req.body.txtId) +1,
        CAT_NAME: req.body.name,
    }
    console.log(entity);
    const rows = await model.addCat(entity);
    res.redirect('/admin/categories');
});

router.post('/:id',async(req,res)=>{
   
    const rows = await model.editCat(req.params.id,req.body.txtName);
    res.redirect('/admin/categories');
});

router.post('/',async(req,res)=>{
   
   const rows = await model.delCat(parseInt(req.body.txtId));
   res.redirect('/admin/categories');
  
});

module.exports = router;