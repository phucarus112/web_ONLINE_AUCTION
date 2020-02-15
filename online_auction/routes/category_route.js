const express = require('express');
const product_model = require('../models/product_model');
const user_model  = require('../models/user_model');
const router = express.Router();
const config = require('../config/default.json');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);
const restrict = require('../middlewares/auth.mdw');
const moment = require('moment');
const util = require('util');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

router.get('/:id',async(req,res)=>{

    const limit = config.paginate.limit;
    const catId = req.params.id;

    const page = req.query.page || 1;
    if(page<1)page=1;
    const offset = (page-1)*config.paginate.limit;

    const [total,rows] = await Promise.all([
        product_model.countByCat(catId),
        product_model.pageByCat(catId,offset)
    ])

    //const total = await product_model.countByCat(catId);
    let nPages = Math.floor(total/limit);
    if(total % limit > 0 )nPages++;
    const page_numbers = [];

    for(i = 1;i <= nPages ;i++)
    {
        page_numbers.push({
            value:i,
            isCurrentPage: i==+page,
        });
    }
    
    for(i = 0;i<rows.length ;i++)
    {
        if(rows[i].BIDDER == -1) //khong co ai
        {
            rows[i].BIDDER = "Chưa có";
        }
        else{
            const sub = await product_model.findBidder(rows[i].ID);
            rows[i].BIDDER = sub[0].USERNAME;
            const len = rows[i].BIDDER.length/2;
            for(j = 0 ;j<parseInt(len);j++)
                {
                    rows[i].BIDDER =  rows[i].BIDDER.replace(rows[i].BIDDER[j],'*');
                } 
        }
    }

    const cat1 = await product_model.loadCategories(); 
    const still = await product_model.isStillAuction();

    for(i=0;i<still.length;i++){
        for(j=0;j<rows.length;j++){
            if(still[i].ID === rows[j].ID){
                rows[j].DESCRIPTION = "";
            }
        }  
    }

    for(i=0;i<rows.length;i++){
        if(rows[i].DESCRIPTION != ""){
            rows[i].DESCRIPTION = "EXPIRED";
            const update = await product_model.updateWhenFinish(rows[i].ID);
            if(req.session.isAuthenticated === true){
                const isAdded = await product_model.isAddedWonList(rows[i].ID);
                console.log(isAdded.length);
                const result = await product_model.findIdBidderFromProduct(rows[i].ID);

                if(isAdded.length === 0){
                 
                  const entity = {
                      USER_ID: result[0].BIDDER,
                      PRODUCT_ID: rows[i].ID,
                      PRICE: rows[i].PRICE,
                      DATE: rows[i].DAYEND,
                  };
                  const add = await product_model.addWonList(entity);
                  if(rows[i].TURN_AUCTION > 0){
                    const bidder = await product_model.fineNameBidder(result[0].BIDDER);
                    const distinct = await product_model.distinctUserAuction(rows[i].ID);
                    var strEmail = "";
                    console.log(distinct.length);
                    for(a = 0 ;a< distinct.length;a++){
                        const bidderSub = await product_model.fineNameBidder(distinct[a].USER_ID);
                        strEmail = strEmail + String(bidderSub[0].EMAIL) ;
                        if(a != distinct.length -1){
                            strEmail = strEmail + " , ";
                        }
                    }
                    console.log(strEmail);

                    var transporter = nodemailer.createTransport(({
                        service: 'gmail',
                        auth: {
                            user: 'huynhphuc211.thcs@gmail.com', // email hoặc username
                            pass: 'lehuynhphuc' // password
                        },
                    }));
      
                    var mail = {
                        from: 'huynhphuc211.thcs@gmail.com', // Địa chỉ email của người gửi
                        to: strEmail, // Địa chỉ email của người gửi
                        subject: `Kết thúc đấu giá sản phẩm "${rows[i].NAME}"`, // Tiêu đề mail
                        text: `Người chiến thắng đợt đấu giá này là tài khoản "${bidder[0].USERNAME}" với giá là ${rows[i].PRICE} VND. Hẹn gặp lại bạn trong những đợt đấu giá tiếp theo.`, // Nội dung mail dạng text
                    };       
                        
                    transporter.sendMail(mail, function(error, info) {
                                if (error) { // nếu có lỗi
                                    console.log(error);
                                } else { //nếu thành công
                                    console.log('Email sent: ' + info.response);
                                    console.log(req.session.authUser.EMAIL);
                                }
                    });  
                  }
                
                }
              }
        }
    }

    for(i = 0;i<rows.length ;i++)
    {
        if(rows[i].BIDDER == -1) //khong co ai
        {
            rows[i].BIDDER = "Chưa có";
        }
    }
   
    res.render('vwProducts/allByCat',{
        products: rows,
        empty: rows.length === 0,
        page_numbers,
        pre_value: +page -1,
        next_value: +page +1,
        categories: cat1,
        emptyCat: cat1.length === 0,
        len: total,
    });
});

router.post('/:id',async(req,res)=>{
    const row3 = await product_model.isLoveProduct(req.session.authUser.ID,parseInt(req.body.pid));
    
});

router.get('/history/:id', restrict, async(req,res)=>{
    const rows = await product_model.loadHisPro(req.params.id);
    const isProductBySeller = await product_model.isProductBySeller(req.params.id);
    const isEnd = await product_model.isEnd(req.params.id);
    const cat1 = await product_model.loadCategories(); 

    if(req.session.isSeller === true)
    {
        if(rows.length >0)
        {
            for(j=0;j<rows.length;j++)
            {
                const len = rows[j].USERNAME.length /2;
                for(i = 0 ;i<parseInt(len);i++)
                {
                    rows[j].USERNAME =  rows[j].USERNAME.replace(rows[j].USERNAME[i],'*');
                } 
            }
        }
    }

    res.render('vwProducts/history',{
       hispro: rows,
       empty: rows.length === 0, 
       okPBS: isProductBySeller[0].SELLER === req.session.authUser.ID,
       end: isEnd[0].STATUS === 1,
       categories: cat1,
        emptyCat: cat1.length === 0,
    });
   
 });

router.post('/history/:id', async(req,res)=>{
    
    const rows = await product_model.findSecondBidder(req.params.id);
    if(rows.length > 0)
    {
      
        const res1 = await product_model.rejectAuctionFromAL(rows[0].USER_ID,
            req.params.id, parseInt(req.body.txtId));
        const res2 = await product_model.rejectAuctionFromHP(rows[0].USER_ID,
            req.params.id, parseInt(req.body.txtId));
        const bidder = await product_model.findBidder(rows[0].USER_ID);

        var transporter = nodemailer.createTransport(({
                service: 'gmail',
                auth: {
                    user: 'huynhphuc211.thcs@gmail.com', // email hoặc username
                    pass: 'lehuynhphuc' // password
                },
            }));   
        if(rows.length === 1)
        {
            const temp = await product_model.findOriPrice(req.params.id);
            const res3 = await product_model.editBidderAndPrice2(req.params.id,-1,
                temp[0].ORIGINAL_PRICE);
            
             var mail = {
                    from: 'huynhphuc211.thcs@gmail.com', // Địa chỉ email của người gửi
                    to: bidder[0].EMAIL, // Địa chỉ email của người gửi
                    subject: 'Thông báo từ ban quản trị', // Tiêu đề mail
                    text: `Xin chia buồn. Bạn đã bị người bán kick ra khỏi lượt đấu giá sản phẩm này. `, // Nội dung mail dạng text
                };       
                    
                transporter.sendMail(mail, function(error, info) {
                            if (error) { // nếu có lỗi
                                console.log(error);
                            } else { //nếu thành công
                                console.log('Email sent: ' + info.response);
                                console.log(req.session.authUser.EMAIL);
                            }
                        });  
        }
        else{
            if(parseInt(req.body.txtId) === parseInt(rows[0].PRICE))
            {
                const res3 = await product_model.editBidderAndPrice2(req.params.id,rows[1].USER_ID,
                    rows[1].PRICE);

                var mail = {
                        from: 'huynhphuc211.thcs@gmail.com', // Địa chỉ email của người gửi
                        to: bidder[0].EMAIL, // Địa chỉ email của người gửi
                        subject: 'Thông báo từ ban quản trị', // Tiêu đề mail
                        text: `Xin chia buồn. Bạn đã bị người bán kick ra khỏi lượt đấu giá sản phẩm này. `, // Nội dung mail dạng text
                    };     
                        
                    transporter.sendMail(mail, function(error, info) {
                                if (error) { // nếu có lỗi
                                    console.log(error);
                                } else { //nếu thành công
                                    console.log('Email sent: ' + info.response);
                                    console.log(req.session.authUser.EMAIL);
                                }
                            }); 
            }
            else{
                const res3 = await product_model.editTurnAuction(req.params.id);
                var mail = {
                    from: 'huynhphuc211.thcs@gmail.com', // Địa chỉ email của người gửi
                    to: bidder[0].EMAIL, // Địa chỉ email của người gửi
                    subject: 'Thông báo từ ban quản trị', // Tiêu đề mail
                    text: `Xin chia buồn. Bạn đã bị người bán kick ra khỏi lượt đấu giá sản phẩm này. `, // Nội dung mail dạng text
                };       
                    
                transporter.sendMail(mail, function(error, info) {
                            if (error) { // nếu có lỗi
                                console.log(error);
                            } else { //nếu thành công
                                console.log('Email sent: ' + info.response);
                                console.log(req.session.authUser.EMAIL);
                            }
                        }); 
            }
        }
    }

    res.redirect(`/categories/history/${req.params.id}`);
});

router.get('/report/:id/:idSeller', restrict, async(req,res)=>{
    
    const rows = await user_model.getReport(req.params.idSeller);
    const cat1 = await product_model.loadCategories();
    res.render('vwProducts/report',{
        reportlist: rows,
        empty: rows.length === 0,
        categories: cat1,
        emptyCat: cat1.length === 0,
    });
 });

 router.post('/report/:id/:idSeller',  async(req,res)=>{
    let current = moment();
    const entity ={
        USER_ID: req.session.authUser.ID,
        PRODUCT_ID: 0,
        PERSON_ID: req.params.idSeller,
        CONTENT: req.body.cmt,
        DATE: current.format('YYYY-MM-DD hh:mm:ss'),
    }
    const rows = await user_model.sendReport(entity);
    if(req.session.isSeller === true)
    {
        res.redirect(`/boughtproduct`);
    }
    res.redirect(`/categories/detail/${req.params.id}`);
 });

router.get('/auction/:id', restrict, async(req,res)=>{

    const rows = await user_model.checkBeforeAuc(req.session.authUser.ID);
    const rows2 = await product_model.getPriceAndStep(req.params.id);
    const cat1 = await product_model.loadCategories();
    const isStill = await product_model.isStillAuctionSingle(req.params.id);

    if(isStill.length === 0)//da het thoi gian
    {
        const update = await product_model.updateWhenFinish(req.params.id);
    }

    res.render('vwProducts/auction',{
        point: rows[0],
        valid: (rows[0].POINT_PLUS / (rows[0].POINT_PLUS + rows[0].POINT_SUBSTRACT) >= 0.8)
        || (rows[0].POINT_PLUS === 0 && rows[0].POINT_SUBSTRACT === 0),
        PriceAndStep: rows2[0],
        categories: cat1,
        emptyCat: cat1.length === 0,
        still: isStill.length != 0,
    })
 });

 router.post('/auction/:id',async(req,res)=>{
    
    let current = moment();
  
    var transporter = nodemailer.createTransport(({
        service: 'gmail',
        auth: {
            user: 'huynhphuc211.thcs@gmail.com', // email hoặc username
            pass: 'lehuynhphuc' // password
        },
    }));      

    if(req.body.temp == "1")
    {
        //mac dinh 
        const entity = {
            USER_ID: req.session.authUser.ID,
            PRODUCT_ID: parseInt(req.params.id),
            PRICE: parseInt(req.body.temp3),
            DATE: current.format('YYYY-MM-DD hh:mm:ss'),
        };
        const rows = await product_model.addAucList(entity);
        const rows2 = await product_model.addHisPro(entity);
        const rows3 = await product_model.editBidderAndPrice(parseInt(req.params.id),req.session.authUser.ID,
            parseInt(req.body.temp3));
        const name = await product_model.findNameProduct(req.params.id);
        var mail = {
            from: 'huynhphuc211.thcs@gmail.com', // Địa chỉ email của người gửi
            to: req.session.authUser.EMAIL, // Địa chỉ email của người gửi
            subject: 'Đặt giá thành công', // Tiêu đề mail
            text: `Cảm ơn bạn đã đặt giá ${req.body.temp3} VNĐ cho sản phẩm ${name[0].NAME}. Theo dõi trang web thường xuyên cho đến khi đấu giá kết thúc `, // Nội dung mail dạng text
        };       
            
        transporter.sendMail(mail, function(error, info) {
                    if (error) { // nếu có lỗi
                        console.log(error);
                    } else { //nếu thành công
                        console.log('Email sent: ' + info.response);
                    }
                });  
    }
    else{
        //nhap vao
        const entity = {
            USER_ID: req.session.authUser.ID,
            PRODUCT_ID: parseInt(req.params.id),
            PRICE: parseInt(req.body.temp1) + parseInt(req.body.aucCost)*parseInt(req.body.temp2) ,
            DATE: current.format('YYYY-MM-DD hh:mm:ss'),
        };
        console.log(entity);
        const rows = await product_model.addAucList(entity);
        const rows2 = await product_model.addHisPro(entity);
        const rows3 = await product_model.editBidderAndPrice(parseInt(req.params.id),req.session.authUser.ID,
            entity.PRICE);
            console.log(entity.PRICE);
            const name = await product_model.findNameProduct(req.params.id);
            var mail = {
                from: 'huynhphuc211.thcs@gmail.com', // Địa chỉ email của người gửi
                to: req.session.authUser.EMAIL, // Địa chỉ email của người gửi
                subject: 'Đặt giá thành công', // Tiêu đề mail
                text: `Cảm ơn bạn đã đặt giá ${req.body.temp3} VNĐ cho sản phẩm ${name[0].NAME}.Theo dõi trang web thường xuyên cho đến khi đấu giá kết thúc `, // Nội dung mail dạng text
            };       
                
            transporter.sendMail(mail, function(error, info) {
                        if (error) { // nếu có lỗi
                            console.log(error);
                        } else { //nếu thành công
                            console.log('Email sent: ' + info.response);
                        }
                    });  
            
    }
    res.redirect(`/categories/detail/${req.params.id}`);
 });

router.get('/detail/:id',async(req,res)=>{

    const rows = await product_model.detail(req.params.id);
   
    const cat = rows[0].CATEGORIES;
    const rows2 = await product_model.related(req.params.id,cat);
    const seller = await product_model.findSeller(req.params.id);
    const bidder = await product_model.findBidder(req.params.id);
    const cat1 = await product_model.loadCategories();
    const isStill = await product_model.isStillAuctionSingle(req.params.id);

    if(isStill.length === 0)//da het thoi gian
    {
        const update = await product_model.updateWhenFinish(req.params.id);
        if(req.session.isAuthenticated === true){
            const isAdded = await product_model.isAddedWonList(req.params.id);
            const result = await product_model.findIdBidderFromProduct(req.params.id);

            if(isAdded.length === 0){
              const entity = {
                  USER_ID: result[0].BIDDER,
                  PRODUCT_ID: req.params.id,
                  PRICE: rows[0].PRICE,
                  DATE: rows[0].DAYEND,
              };
             
              const add = await product_model.addWonList(entity);
              if(rows[0].TURN_AUCTION > 0){
                const bidder = await product_model.fineNameBidder(result[0].BIDDER);
                const distinct = await product_model.distinctUserAuction(req.params.id);
                var strEmail = "";
                console.log(distinct.length);
                for(a = 0 ;a< distinct.length;a++){
                    const bidderSub = await product_model.fineNameBidder(distinct[a].USER_ID);
                    strEmail = strEmail + String(bidderSub[0].EMAIL) ;
                    if(a != distinct.length -1){
                        strEmail = strEmail + " , ";
                    }
                }
                console.log(strEmail);
  
                var transporter = nodemailer.createTransport(({
                  service: 'gmail',
                  auth: {
                      user: 'huynhphuc211.thcs@gmail.com', // email hoặc username
                      pass: 'lehuynhphuc' // password
                  },
              }));
  
                var mail = {
                    from: 'huynhphuc211.thcs@gmail.com', // Địa chỉ email của người gửi
                    to: strEmail, // Địa chỉ email của người gửi
                    subject: `Kết thúc đấu giá sản phẩm "${rows[0].NAME}"`, // Tiêu đề mail
                    text: `Người chiến thắng đợt đấu giá này là tài khoản "${bidder[0].USERNAME}" với giá là ${rows[0].PRICE} VND. Hẹn gặp lại bạn trong những đợt đấu giá tiếp theo.`, // Nội dung mail dạng text
                };       
                    
                transporter.sendMail(mail, function(error, info) {
                            if (error) { // nếu có lỗi
                                console.log(error);
                            } else { //nếu thành công
                                console.log('Email sent: ' + info.response);
                                console.log(req.session.authUser.EMAIL);
                            }
                        });  
              }
              
            }
          }
    }

    if(req.session.isSeller === true)
    {
        //seller: masked bidder, full seller
        if(bidder.length > 0 )
        {
        const len = bidder[0].USERNAME.length /2;
        for(i = 0 ;i<parseInt(len);i++)
        {
            bidder[0].USERNAME =  bidder[0].USERNAME.replace(bidder[0].USERNAME[i],'*');
        } 
        }
    }
    else{
        //bidder: masked seller, full bidder
        const len = seller[0].USERNAME.length /2;
        for(i = 0 ;i<parseInt(len);i++)
        {
            seller[0].USERNAME =  seller[0].USERNAME.replace(seller[0].USERNAME[i],'*');
        } 
    }

   
        if(rows[0].BIDDER == -1) //khong co ai
        {
            rows[0].BIDDER = "Chưa có";
        }
   
    
    if(req.session.isAuthenticated === true)
    {
        const row3 = await product_model.isLoveProduct(req.session.authUser.ID,req.params.id);
        const isProductBySeller = await product_model.isProductBySeller(req.params.id);
        res.render('vwProducts/detail',{
            detail: rows[0],
            related: rows2,
            isLove: row3[0],
            nameSeller: seller[0],
            nameBidder: bidder[0],
            empty: rows.length === 0,
            empty2: rows2.length === 0,
            empty3: row3.length === 0,
            noBidder: bidder.length === 0,
            okPBS: isProductBySeller[0].SELLER === req.session.authUser.ID,
            categories: cat1,
            emptyCat: cat1.length === 0,
            still: isStill.length != 0,
        });
    }
    else{
        res.render('vwProducts/detail',{
            detail: rows[0],
            related: rows2,
            nameSeller: seller[0],
            nameBidder: bidder[0],
            empty: rows.length === 0,
            empty2: rows2.length === 0,
            noBidder: bidder.length === 0,
            categories: cat1,
            emptyCat: cat1.length === 0,
            still: isStill.length != 0,
        });
    } 
});

router.post('/detail/:id',async(req,res)=>{

    console.log(req.body.temp);
    if(req.body.temp == "0")
    {
        const rows = await product_model.removeLoveProduct(req.session.authUser.ID,req.body.txtId);
    }
    else
    {
        const entity = {
            USER_ID: req.session.authUser.ID,
            PRODUCT_ID: req.body.txtId,
        }
        const rows = await product_model.addLoveProduct(entity);
    }
    res.redirect(`/categories/detail/${req.body.txtId}`);
});

router.post('/detail/:id/patch',async(req,res)=>{
    
    const rows = await product_model.patchDes(req.params.id,req.body.txtDes);
    res.redirect(`/`);
});

module.exports = router;