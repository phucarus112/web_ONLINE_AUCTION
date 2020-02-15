const express = require('express');
const product_model = require('../models/product_model');
const user_model = require('../models/user_model');
const config = require('../config/default.json');
const router = express.Router();
const restrict = require('../middlewares/auth.mdw');
const nodemailer = require('nodemailer');

router.get('/',async(req,res)=>{

    const rows = await product_model.sortByPrice();
    const rows1 = await product_model.sortByTurn();
    const row3 = await product_model.sortByDate();
    const cat = await product_model.loadCategories();
    const recently = await product_model.loadRecentlyPro();

    var transporter = nodemailer.createTransport(({
        service: 'gmail',
        auth: {
            user: 'huynhphuc211.thcs@gmail.com', // email hoặc username
            pass: 'lehuynhphuc' // password
        },
    }));

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

        if(rows1[i].BIDDER == -1) //khong co ai
        {
            rows1[i].BIDDER = "Chưa có";
        }
        else{
            const sub = await product_model.findBidder(rows1[i].ID);
            rows1[i].BIDDER = sub[0].USERNAME;
            const len = rows1[i].BIDDER.length/2;
            for(j = 0 ;j<parseInt(len);j++)
                {
                    rows1[i].BIDDER =  rows1[i].BIDDER.replace(rows1[i].BIDDER[j],'*');
                } 
        }

        if(row3[i].BIDDER == -1) //khong co ai
        {
            row3[i].BIDDER = "Chưa có";
        }
        else{
            const sub = await product_model.findBidder(row3[i].ID);
            row3[i].BIDDER = sub[0].USERNAME;
            const len = row3[i].BIDDER.length/2;
            for(j = 0 ;j<parseInt(len);j++)
                {
                    row3[i].BIDDER =  row3[i].BIDDER.replace(row3[i].BIDDER[j],'*');
                } 
        }
    }
    if(rows.length ==0 || rows1.length == 0)
    {
      throw new Error('ERROR');
    }

    const still = await product_model.isStillAuction();

    for(i=0;i<still.length;i++){
      for(j=0;j<row3.length;j++){
          if(still[i].ID === row3[j].ID){
              row3[j].DESCRIPTION = "";
          }
      }  
  }

  for(i=0;i<row3.length;i++){
      if(row3[i].DESCRIPTION != ""){
          row3[i].DESCRIPTION = "EXPIRED";
          const update = await product_model.updateWhenFinish(row3[i].ID);
            if(req.session.isAuthenticated === true){
              const isAdded = await product_model.isAddedWonList(row3[i].ID);
              console.log(isAdded.length);
              const result = await product_model.findIdBidderFromProduct(row3[i].ID);

              if(isAdded.length === 0){
                const entity = {
                    USER_ID: result[0].BIDDER,
                    PRODUCT_ID: row3[i].ID,
                    PRICE: row3[i].PRICE,
                    DATE: row3[i].DAYEND,
                };
                const add = await product_model.addWonList(entity);
                if(row3[i].TURN_AUCTION > 0)
                {
                const bidder = await product_model.fineNameBidder(result[0].BIDDER);
                const distinct = await product_model.distinctUserAuction(row3[i].ID);
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
  
                var mail = {
                    from: 'huynhphuc211.thcs@gmail.com', // Địa chỉ email của người gửi
                    to: strEmail, // Địa chỉ email của người gửi
                    subject: `Kết thúc đấu giá sản phẩm "${row3[i].NAME}"`, // Tiêu đề mail
                    text: `Người chiến thắng đợt đấu giá này là tài khoản "${bidder[0].USERNAME}" với giá là ${row3[i].PRICE} VND. Hẹn gặp lại bạn trong những đợt đấu giá tiếp theo.`, // Nội dung mail dạng text
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
                if(rows[i].TURN_AUCTION >0)
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

    for(i=0;i<still.length;i++){
      for(j=0;j<rows1.length;j++){
          if(still[i].ID === rows1[j].ID){
              rows1[j].DESCRIPTION = "";
          }
      }  
  }

  for(i=0;i<rows1.length;i++){
      if(rows1[i].DESCRIPTION != ""){
          rows1[i].DESCRIPTION = "EXPIRED";
          const update = await product_model.updateWhenFinish(rows1[i].ID);
          if(req.session.isAuthenticated === true){
            const isAdded = await product_model.isAddedWonList(rows1[i].ID);
            console.log(isAdded.length);
            const result = await product_model.findIdBidderFromProduct(rows1[i].ID);
            
            if(isAdded.length === 0){
              const entity = {
                  USER_ID: result[0].BIDDER,
                  PRODUCT_ID: rows1[i].ID,
                  PRICE: rows1[i].PRICE,
                  DATE: rows1[i].DAYEND,
              };
              const add = await product_model.addWonList(entity);
              if(rows1[i].TURN_AUCTION > 0){
                const bidder = await product_model.fineNameBidder(result[0].BIDDER);
                const distinct = await product_model.distinctUserAuction(rows1[i].ID);
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
  
                var mail = {
                    from: 'huynhphuc211.thcs@gmail.com', // Địa chỉ email của người gửi
                    to: strEmail, // Địa chỉ email của người gửi
                    subject: `Kết thúc đấu giá sản phẩm "${rows1[i].NAME}"`, // Tiêu đề mail
                    text: `Người chiến thắng đợt đấu giá này là tài khoản "${bidder[0].USERNAME}" với giá là ${rows1[i].PRICE} VND. Hẹn gặp lại bạn trong những đợt đấu giá tiếp theo.`, // Nội dung mail dạng text
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

    if(req.session.isAuthenticated === true)
    {
        const row2 = await product_model.countLoveProduct(req.session.authUser.ID);
        const row4 = await product_model.countAuctionProduct(req.session.authUser.ID);
        const row5 = await product_model.countWonProduct(req.session.authUser.ID);
        const row6 = await product_model.loadLoveProduct(req.session.authUser.ID);
        const row7 = await product_model.loadAuctionProduct(req.session.authUser.ID);
        const row8 = await product_model.loadWonProduct(req.session.authUser.ID);
        const noti = await user_model.countRequire();
        console.log(noti[0].total);
        res.render('index',{
          sortPrice: rows,
          sortTurn: rows1,
          sortDate: row3,
          empty: rows.length === 0,
          countLoveProduct: row2[0],
          countAuctionProduct: row4[0],
          countWonProduct: row5[0],
          emptyLove: row6.length === 0,
          emptyAuction: row7.length === 0,
          emptyWon: row8.length === 0,
          loveProduct: row6,
          auctionProduct: row7,
          wonProduct: row8,
          totalRequire: noti[0],
          categories: cat,
          emptyCat: cat.length === 0,
         hotpro: recently,
         no_hotpro: recently.length === 0,
        });
    }
else
{
  res.render('index',{
    sortPrice: rows,
    sortTurn: rows1,
    sortDate: row3,
    empty: rows.length === 0,
    categories: cat,
    emptyCat: cat.length === 0,
    hotpro: recently,
    no_hotpro: recently.length === 0,
  });
}
     
     
})

router.post('/',async(req,res)=>{
  const entity = {
    USER_ID: req.session.authUser.ID,
    PRODUCT_ID: req.body.txtId,
  };
  
  console.log(entity.PRODUCT_ID);
 
  
  const rows = await product_model.addLoveProduct(entity);
  
});

module.exports = router;