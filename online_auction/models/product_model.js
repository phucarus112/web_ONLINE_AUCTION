const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    all: () => db.load('select * from product'),

    detail: id=> db.load(`SELECT p.ID,p.NAME,p.DESCRIPTION,p.PRICE,p.STATUS,p.DAYSTART,p.DAYEND,p.SELLER,p.TURN_AUCTION,p.BUOCGIA,p.BIDDER,p.CATEGORIES,c.CAT_NAME FROM online_auction.product p, online_auction.categories c WHERE p.CATEGORIES = c.ID  && p.ID = ${id}`),
    
    allByCat: catId => db.load( `select * from product where CATEGORIES = ${catId}`),
    
    pageByCat: (catId,offset) => db.load( `select * from product where CATEGORIES = ${catId} limit 
    ${config.paginate.limit} offset ${offset}`),
    
    countByCat: async catId =>{
        const rows = await db.load( `select count(*) as total from product where CATEGORIES = ${catId}`);
        return rows[0].total ;
    },
    
    single: id => db.load( `select * from product where ID = ${id}`),
    
    add: entity => db.add('product',entity),
    
    del: id =>  db.del('product',{ID: id}),
    
    patch: entity => {
        const condition = {ID: entity.ID};
        delete entity.ID;
        console.log(entity,condition);
       return db.patch('product',entity,condition);
    },

    isProductBySeller: (id) => db.load(`select SELLER from product where ID = ${id}`),

    patchDes: (id,des) => db.load(`update product set DESCRIPTION = "${des}"  where ID = ${id}`),
    
    search: key => db.load(`SELECT * FROM PRODUCT WHERE NAME LIKE '%${key}%'`),
    
    searchPrice: key => db.load(`SELECT * FROM PRODUCT WHERE NAME LIKE '%${key}%' order BY PRICE DESC`),
    
    pageBySearch: (key,offset) => db.load( `select * from product where NAME LIKE '%${key}%' limit 
    ${config.paginate.limit} offset ${offset}`),
    
    countBySearch: async key =>{
        const rows = await db.load( `select count(*) as total from product where NAME LIKE '%${key}%'`);
        return rows[0].total ;
    },
    
    pageBySearchPrice: (key,offset) => db.load( `select * from product where NAME LIKE '%${key}%' order BY PRICE DESC limit 
    ${config.paginate.limit} offset ${offset}`),
    
    countBySearchPrice: async key =>{
        const rows = await db.load( `select count(*) as total from product where NAME LIKE '%${key}%' order BY PRICE DESC`);
        return rows[0].total ;
    },
    
    sortByDate: () => db.load(`SELECT * FROM online_auction.product where STATUS = 0 order by (DAYEND - current_date()) limit 5 ;`),
    
    sortByPrice: () => db.load(`SELECT * FROM online_auction.product where STATUS = 0 order by PRICE desc limit 5`),
    
    sortByTurn: () => db.load( `SELECT * FROM online_auction.product where STATUS = 0 order by TURN_AUCTION DESC LIMIT 5`),
    
    related: (id,catId) => db.loadRelated(`SELECT * FROM online_auction.product where ID != ${id} && CATEGORIES = ${catId}`),
    
    addLoveProduct: entity => db.add('watch_list',entity),
    
    loadLoveProduct: (id) => db.load(`SELECT p.ID, p.NAME, p.PRICE, p.TURN_AUCTION FROM online_auction.product p, online_auction.watch_list w where p.ID = w.PRODUCT_ID && w.USER_ID = ${id};`),
    
    loadAuctionProduct: (id) => db.load(`SELECT p.ID, p.NAME, w.PRICE, p.TURN_AUCTION, w.DATE FROM online_auction.product p, online_auction.auction_list w where p.ID = w.PRODUCT_ID && w.USER_ID = ${id};`),
    
    loadWonProduct: (id) => db.load(`SELECT p.ID, p.NAME, p.PRICE, w.DATE FROM online_auction.product p, online_auction.won_list w where p.ID = w.PRODUCT_ID && w.USER_ID = ${id};`),
    
    loadSellingProduct: id => db.load(`SELECT * FROM product WHERE SELLER = ${id} && STATUS = 0`),

    loadBoughtProduct: id => db.load(`SELECT * FROM product p, won_list w, user u WHERE p.SELLER = ${id} && p.STATUS = 1 && p.ID = w.PRODUCT_ID && w.USER_ID = u.ID`),

    loadHisPro: (id) => db.load(`SELECT u.ID, h.PRODUCT_ID, u.USERNAME, h.PRICE,h.DATE FROM online_auction.history_product h, online_auction.user u where PRODUCT_ID = ${id} && h.USER_ID = u.ID;`),

    loadCategories: () => db.load(`select * from categories`),

    loadRecentlyPro: ()=>db.load(`SELECT * FROM online_auction.product where (current_timestamp()- DAYSTART )<100000;`),
    
    removeLoveProduct: (user_id,product_id) => db.load(`DELETE FROM watch_list WHERE USER_ID = ${user_id} && PRODUCT_ID = ${product_id}`),

    rejectAuctionFromAL: (user_id,product_id, price) => db.load(`DELETE FROM auction_list  WHERE USER_ID = ${user_id} && PRODUCT_ID = ${product_id} && PRICE = ${price} `),

    rejectAuctionFromHP: (user_id,product_id,price) => db.load(`DELETE FROM history_product WHERE USER_ID = ${user_id} && PRODUCT_ID = ${product_id} && PRICE = ${price}`),
    
    isLoveProduct: (user_id,product_id) => db.load(`SELECT * FROM online_auction.watch_list where USER_ID = ${user_id} && PRODUCT_ID = ${product_id};`),
   
    isEnd: (id) => db.load(`SELECT STATUS FROM product where ID = ${id}`),

    isStillAuction: () => db.load(`SELECT * FROM online_auction.product where (DAYEND - current_timestamp())>0;`),

    isStillAuctionSingle: (id) => db.load(`SELECT * FROM online_auction.product where ID = ${id} && (DAYEND - current_timestamp())>0;`),

    isAddedWonList: id => db.load(`SELECT * FROM online_auction.won_list where PRODUCT_ID = ${id};`),
    
    countLoveProduct: (id) => db.load(`SELECT count(*) as total FROM online_auction.watch_list where USER_ID = ${id};`),
    
    countAuctionProduct: (id)  => db.load(`SELECT count(*) as total FROM online_auction.auction_list where USER_ID = ${id};`),
    
    countWonProduct:(id)  => db.load(`SELECT count(*) as total FROM online_auction.won_list where USER_ID = ${id}; `),
    
    getPriceAndStep: id => db.load(`SELECT PRICE, BUOCGIA, TURN_AUCTION, (PRICE + BUOCGIA) as total FROM online_auction.product WHERE ID = ${id};`),
    
    addAucList: entity => db.add('auction_list',entity),
    
    addHisPro: entity => db.add('history_product',entity),

    addWonList: entity => db.add('won_list',entity),

    editTurnAuction: (id) => db.load(`update product set TURN_AUCTION = TURN_AUCTION - 1 where ID = ${id}`),
    
    editBidderAndPrice: (id,bidder,price) => db.load(`update product set PRICE = ${price} , BIDDER = ${bidder}, TURN_AUCTION = TURN_AUCTION + 1 where ID = ${id}`),

    editBidderAndPrice2: (id,bidder,price) => db.load(`update product set PRICE = ${price} , BIDDER = ${bidder}, TURN_AUCTION = TURN_AUCTION - 1 where ID = ${id}`),

    findSeller: id => db.load(`SELECT u.ID, u.USERNAME FROM online_auction.product p, online_auction.user u where p.SELLER = u.ID &&  p.ID = ${id}	;`),

    findBidder: id => db.load(`SELECT user.USERNAME, user.EMAIL, user.POINT_PLUS, user.POINT_SUBSTRACT FROM user, product where user.ID = product.BIDDER && product.ID =${id}`),

    fineNameBidder: id => db.load(`SELECT * FROM user where ID = ${id}` ),

    findIdBidderFromProduct: id => db.load(`select BIDDER from product where ID = ${id}`),

    findSecondBidder: id => db.load(`SELECT * FROM online_auction.history_product where PRODUCT_ID = ${id} order by PRICE desc;`),

    findOriPrice: id => db.load(`select ORIGINAL_PRICE FROM product where ID = ${id}`),

    findNameProduct: id => db.load(`select NAME from product where ID = ${id}`),

    updateWhenFinish: id => db.load(`update product set STATUS = 1 where ID = ${id}`),

    distinctUserAuction: id => db.load(`SELECT distinct USER_ID FROM online_auction.history_product where PRODUCT_ID = ${id} ;`),
}