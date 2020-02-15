
module.exports = function (app) {
    app.use(async (req, res, next) => {
     
      if (typeof (req.session.isAuthenticated) === 'undefined') {
        req.session.isAuthenticated = false;
      }
      
      
      if (typeof (req.session.isAdmin) === 'undefined') {
        req.session.isAdmin = false;
      }
      
      
      if (typeof (req.session.isSeller) === 'undefined') {
        req.session.isSeller = false;
      }

      res.locals.isAuthenticated = req.session.isAuthenticated;
      res.locals.isAdmin = req.session.isAdmin;
      res.locals.isSeller = req.session.isSeller;
      res.locals.authUser = req.session.authUser;
      res.locals.keyword = req.session.keyword;
      next();
    })
  };