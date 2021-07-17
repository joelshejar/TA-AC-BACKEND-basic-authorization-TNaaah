var express = require('express');
var router = express.Router();

var User = require('../models/user');

var auth = require('../middlewares/auth');
var upload = require('../utils/multer');
var UserMedia = require('../models/usermedia');

router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/signup', (req, res, next) => {
  console.log(req.session, req.user);
  var error = req.flash('error');
  res.render('signup', { error });
});
router.get('/login', (req, res, next) => {
  console.log(req.session);
  var error = req.flash('error');
  res.render('login', { error });
});

router.post('/signup', (req, res, next) => {
  console.log(req.body, '*************');
  var { email, password } = req.body;
  if (password.length <= 4) {
    req.flash('error', 'minimum password length should be 5');
    return res.redirect('/users/signup');
  }
  User.create(req.body, (err, user) => {
    if (err) next(err);

    res.redirect('/users/login');
    // Cart.create({ owner: user.id }, (err, cart) => {
    //   if (err) next(err);
    //   console.log(cart, 'MyCarttttttttttttttttttttt');
    //   res.redirect('/users/login');
    // });
  });
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'User doesnt exist!! Please signup');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'password is incorrect');
        return res.redirect('/users/login');
      }

      console.log(req.user, 'userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
      req.session.userId = user.id;
      res.redirect('/podcasts');
    });
  });
});
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

router.get('/profile', (req, res, next) => {
  res.render('myprofile');
});

router.post('/avtar', upload.single('avtar'), (req, res, next) => {
  console.log(req.file, '**********');
  req.body.avtar = req.file.filename;
  let id = req.user._id;
  console.log(req.body, 'test');
  User.findByIdAndUpdate(id, req.body, (err, user) => {
    if (err) next(err);
    console.log('after update');
    res.redirect('/podcasts');
  });
});

router.get('/admin', auth.adminUser, (req, res, next) => {
  User.find({ isAdmin: false }, (err, users) => {
    if (err) next(err);
    UserMedia.find({}, (err, podcasts) => {
      if (err) next(err);
      res.render('admin', { users: users, podcasts: podcasts });
    });
  });
});

router.get('/block/:id', auth.adminUser, (req, res, next) => {
  let id = req.params.id;
  User.findByIdAndUpdate(id, { isBlock: true }, (err, users) => {
    if (err) return next(err);
    res.redirect('/users/admin');
  });
});
router.get('/unblock/:id', auth.adminUser, (req, res, next) => {
  let id = req.params.id;
  User.findByIdAndUpdate(id, { isBlock: false }, (err, users) => {
    if (err) return next(err);
    res.redirect('/users/admin');
  });
});
module.exports = router;
