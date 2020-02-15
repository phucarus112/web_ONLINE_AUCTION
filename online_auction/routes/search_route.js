const express = require('express');
const product_model = require('../models/product_model');
const config = require('../config/default.json');
const router = express.Router();
var nodemailer = require('nodemailer');

router.get('/',async(req,res)=>{
  
    x = req.query.keyword;
    if (typeof (x) === 'undefined') {
       x =  req.session.keyword;
    }
     
    console.log(x);
    const limit = config.paginate.limit;
    const catId = req.params.id;

    const page = req.query.page || 1;
    if(page<1)page=1;
    const offset = (page-1)*config.paginate.limit;

    const [total,rows] = await Promise.all([
        product_model.countBySearch(x),
        product_model.pageBySearch(x,offset)
    ])

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
                const result = await product_model.findIdBidderFromProduct(rows[i].ID);
                if(isAdded.length === 0){
                  const entity = {
                      USER_ID: result[0].BIDDER,
                      PRODUCT_ID: rows[i].ID,
                      PRICE: rows[i].PRICE,
                      DATE: rows[i].DAYEND,
                  };
                  console.log(entity);
                  const add = await product_model.addWonList(entity);
                  if(rows[i].TURN_AUCTION > 0)
                  {
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

    const cat1 = await product_model.loadCategories(); 

    req.session.keyword = x;

    res.render('vwSearch/search',{
        resultSearch: rows,
        empty: rows.length === 0,
        page_numbers,
        pre_value: +page -1,
        next_value: +page +1,
        KEY: x,
        categories: cat1,
          emptyCat: cat1.length === 0,
    });
})

router.post('/',async(req,res)=>{

    if(req.body.type === "2") //sxep theo giá
    {
        console.log('xep theo gia');
        const limit = config.paginate.limit;
        const catId = req.params.id;
    
        const page = req.query.page || 1;
        if(page<1)page=1;
        const offset = (page-1)*config.paginate.limit;
        
    
        const [total,rows] = await Promise.all([
            product_model.countBySearchPrice(req.body.temp),
            product_model.pageBySearchPrice(req.body.temp,offset)
        ])
    
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
                    if(rows[i].TURN_AUCTION === 0)
                    {
                        rows[i].BIDDER = -1;
                    }
                    if(isAdded.length === 0){
                      const entity = {
                          USER_ID: rows[i].BIDDER,
                          PRODUCT_ID: rows[i].ID,
                          PRICE: rows[i].PRICE,
                          DATE: rows[i].DAYEND,
                      };
                      const add = await product_model.addWonList(entity);
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
    
        res.render('vwSearch/search',{
            resultSearch: rows,
            empty: rows.length === 0,
            page_numbers,
            pre_value: +page -1,
            next_value: +page +1,
            categories: cat1,
                emptyCat: cat1.length === 0,
        });
    }
    else{
        console.log('xep theo id');
        const limit = config.paginate.limit;
        const catId = req.params.id;
    
        const page = req.query.page || 1;
        if(page<1)page=1;
        const offset = (page-1)*config.paginate.limit;
       
       
    
        const [total,rows] = await Promise.all([
            product_model.countBySearch(req.body.temp),
            product_model.pageBySearch(req.body.temp,offset)
        ])
    
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
                    if(rows[i].TURN_AUCTION === 0)
                    {
                        rows[i].BIDDER = -1;
                    }
                    if(isAdded.length === 0){
                      const entity = {
                          USER_ID: rows[i].BIDDER,
                          PRODUCT_ID: rows[i].ID,
                          PRICE: rows[i].PRICE,
                          DATE: rows[i].DAYEND,
                      };
                      const add = await product_model.addWonList(entity);
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
    
        res.render('vwSearch/search',{
            resultSearch: rows,
            empty: rows.length === 0,
            page_numbers,
            pre_value: +page -1,
            next_value: +page +1,
            categories: cat1,
                emptyCat: cat1.length === 0,
        });
    }
})


module.exports = router;