const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from user where PERMISSION != 2'),
    
    maxID: () => db.findID('SELECT MAX(ID) as max FROM user'),
    
    single: id => db.loadInfo( `select * from user where ID = ${id}`),
    
    add: entity => db.add('user',entity),
    
    del: id =>  db.load(`DELETE FROM user WHERE ID = ${id} `),
    
    singleByUserName: async username =>{
        const rows = await db.loadUser(`select * from user where USERNAME= '${username}'`);
        if (rows.length===0)
         return null;
         return rows[0];
      },
    
      patch: entity => {
        const condition = {ID: entity.ID};
        delete entity.ID;
       return db.patch('user',entity,condition);
    },
    
    editPass: (pass,id) => db.load(`update user set PASSWORD = '${pass}' where ID = ${id}`),
    
    checkBeforeAuc: id => db.load(`SELECT  POINT_PLUS, POINT_SUBSTRACT FROM online_auction.user WHERE ID = ${id};`),
    
    sendReport: entity => db.add('review',entity),
    
    sendUpdateAcc: id => db.load( `update user set PERMISSION = -1 where ID = ${id};`),
    
    getReport: (id) => db.load(`SELECT  u.USERNAME, r.DATE, r.CONTENT FROM online_auction.review r, online_auction.user u where u.Id = r.USER_ID && r.PERSON_ID = ${id} ;`),
    
    getUpdateAcc: id => db.load(`SELECT PERMISSION FROM user where ID  = ${id}`),
    
    countRequire: () => db.load(`SELECT COUNT(*) AS total FROM online_auction.user WHERE PERMISSION = -1;`),
    
    loadRequireList: ()=> db.load(`SELECT * FROM online_auction.user WHERE PERMISSION = -1;`),
    
    acceptRequire: id => db.load(`update user set PERMISSION = 1 where ID = ${id};`),
    
    rejectRequire: id => db.load(`update user set PERMISSION = 0 where ID = ${id};`),
    
    loadEmail: () => db.load(`SELECT EMAIL FROM user`),
    
    loadUser: () => db.load(`select * from user where PERMISSION = 1`),
    
    downLevel: id => db.load(`update user set PERMISSION = 0 where ID = ${id};`),
    
    reportPLUS: id => db.load(`update user set POINT_PLUS = POINT_PLUS + 1 where ID = ${id}`),
    
    reportMINUS: id => db.load(`update user set POINT_SUBSTRACT = POINT_SUBSTRACT + 1 where ID = ${id}`),

}