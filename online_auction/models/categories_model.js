const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    all: () => db.load('select * from product'),
    maxID: () => db.findID('SELECT MAX(ID) as max FROM product'),
    maxIDCat: () => db.findID('SELECT MAX(ID) as max FROM categories'),
    add: entity => db.add('product',entity),
    addCat: entity => db.add('categories',entity),
    single: id => db.load( `select * from product where ID = ${id}`),
    singleCat: id => db.load(`select * from categories where ID = ${id}`),
    patch: entity => {
        const condition = {ID: entity.ID};
        delete entity.ID;
       return db.patch('product',entity,condition);
    },
    editCat: (id,name) => db.load(`update categories set CAT_NAME = "${name}" where ID = ${id}`),
    del: id =>  db.del('product',{ID: id}),
    loadCategories: () => db.load(`select * from categories`),
    recentlyPro: () => db.load(`SELECT * FROM online_auction.product order by (current_date() - DAYSTART) limit 5;`),
    delCat: id => db.load(`DELETE FROM categories WHERE ID = ${id}`),
}