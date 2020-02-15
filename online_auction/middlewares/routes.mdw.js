const restrict = require('../middlewares/auth.mdw');

module.exports = function(app){

    
    app.use('/',require('../routes/sort_route'));
    app.use('/about',require('../routes/terms_route'));
    app.use('/faq',require('../routes/faq_route'));
    app.use('/categories',require('../routes/category_route'));
    app.use(`/search`,require('../routes/search_route'));
    app.use('/account',require('../routes/account_route'));
    app.use('/watchlist',restrict,require('../routes/watch_list_route'));
    app.use('/auctionlist',restrict,require('../routes/auction_list_route'));
    app.use('/wonlist',restrict,require('../routes/won_list_route'));
    app.use('/updateAccount',restrict,require('../routes/update_route'));
    app.use('/uploadProduct',restrict,require('../routes/upload_route'));
    app.use('/boughtproduct',restrict,require('../routes/bought_list_route'));
    app.use('/sellingproduct',restrict,require('../routes/selling_list_route'));

    
    app.use('/admin/home', restrict, require('../routes/admin/home'));
    app.use('/admin/acceptAccount',restrict,require('../routes/admin/accept_route'));
    app.use('/admin/user',restrict,require('../routes/admin/user'));
    app.use('/admin/categories',restrict,require('../routes/admin/categories'));
    

    
}