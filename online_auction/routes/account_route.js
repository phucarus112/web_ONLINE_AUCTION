const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const user_model = require('../models/user_model');
const router = express.Router();
const restrict = require('../middlewares/auth.mdw');

router.get('/register',async(req,res)=>{
    const rows = await user_model.maxID();
    res.render('vwAccount/register',{
        idMax: rows,  
    }); 
   
});

router.post('/register',async(req,res)=>{
    const list = await user_model.loadEmail();
    for(i=0;i<list.length;i++)
    {
      if(list[i].EMAIL === req.body.txtEmail)
      {
        return res.render('vwAccount/register', {
          err_message: 'Email haven`t exit ',
        });
      }
    }
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
    res.redirect('/');
});

router.get('/login',  async(req, res) => {
    res.render('vwAccount/login');
});

router.post('/login', async (req, res) => {
    const user = await user_model.singleByUserName(req.body.username);
    if (user === null){
        return res.render('vwAccount/login', {
           
            err_message: 'Invalid Username'
          });
    }

    const rs = bcrypt.compareSync(req.body.password, user.PASSWORD);
     // bcrypt.compareSync(req.body.password, user.PASSWORD);
      if (rs===false){
        return res.render('vwAccount/login', {
         
          err_message: 'Login failed'
        });
      }
       
      delete user.PASSWORD;
      req.session.isAuthenticated = true;
      req.session.isSeller = false;
      req.session.isAdmin = false;
      if(user.PERMISSION === 1)
      {
        req.session.isSeller = true;
      } 
      if(user.PERMISSION === 2)
      {
        req.session.isAdmin = true;
       
      } 
      req.session.authUser = user;

      if(req.session.isAdmin === true)
      {
        res.redirect('/admin/home');
      }
      const url = req.query.retUrl || '/';
      res.redirect(url);
});

router.post('/logout', (req,res)=>{
  req.session.isAuthenticated = false;
  req.session.isSeller = false;
  req.session.isAdmin = false;
  req.session.authUser = null;
  res.redirect('/');
});

router.get('/profile',  restrict, async(req, res) => {
  const rows = await user_model.single(req.session.authUser.ID);
  res.render('vwAccount/profile',{
      info: rows[0],
  });
 
});

router.post('/patch',async(req,res)=>{
  const dob = moment(req.body.dob,'DD/MM/YYYY').format('YYYY-MM-DD');
  const entity = {
    ID: req.body.txtId,
    USERNAME: req.body.username,
    FULLNAME: req.body.name,
    EMAIL: req.body.email,
    DOB: dob
  }
  console.log(entity);
  const result = await user_model.patch(entity);
  
  res.redirect('/');
});

router.get('/password',async(req,res)=>{
  res.render('vwAccount/changePassword');
});

router.post('/password',async(req,res)=>{
  const hash = bcrypt.hashSync(req.body.newpass,10);
  const rows = await user_model.editPass(hash,req.session.authUser.ID);
  console.log(hash);
  res.redirect('/account/profile');
});

router.get('/report',async(req,res)=>{
  const rows = await user_model.getReport(req.session.authUser.ID);
  res.render('vwAccount/report',{
    listReport: rows,
    empty: rows.length === 0,
  });
});

module.exports = router;