var express = require('express');
const { render } = require('../app');
var router = express.Router();
var Users = require('../models/Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup' , (req, res, next) => {
  res.render('signup', {error: req.flash('error')})
})

router.get('/login' , (req, res, next) => {
  res.render('login', {error : req.flash('error')})
})

router.post('/signup' , (req, res)=> {
  Users.create(req.body , (err , content) =>{
    if(err) {
      if(err.name === 'MongoError'){
        req.flash('error' , 'This email is already used');
        return res.redirect('/users/signup');
      }
      if(err.name === 'ValidationError') {
        console.log(err.name, err.message, "from validation")
        req.flash('error' , err.message);
        return res.redirect('/users/signup');
      }
    }
    res.redirect('/users/login');
  })
})

router.post("/login", function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/password required");
    return res.redirect("/users/login");
  }
  Users.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "User doesnt exist!! Please signup");
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("error", "password is incorrect");
        return res.redirect("/users/login");
      }
      req.session.userId = user.id;
      res.redirect('/')
    });
  });
});
router.get('/logout' , (req, res, next) =>{
  req.session.destroy();
  res.clearCookie()
  res.redirect('/users/login');
})

module.exports = router;
