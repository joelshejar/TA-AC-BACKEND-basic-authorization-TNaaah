const Items = require('../models/Items')
let Users = require('../models/Users');
var Comments = require('../models/Comments')
module.exports = {
    loggedInUser:(req, res, next)=> {
        if(req.session && req.session.userId) {
            next()
        }else{
            console.log("auth")
            res.redirect('/users/login')
        }
    },
    userInfo: (req, res, next)=> {
        var userId = req.session && req.session.userId;
        if(userId) {
            Users.findById(userId ,"name email isAdmin" ,  (err , user)=> {
                if(err) next(err)
                req.user = user;
                res.locals.user = user;
                next();
            })
        }else{
            req.user = null;
            res.locals.user = null;
            next();
        }
    },
    adminUser: (req, res, next)=>{
        var admin  = req.session && req.user.isAdmin;
        if(admin) {
            next()
        }else{
            res.redirect('/users/login');
        }
    },
    CommentInfo : (req, res, next)=> {
        console.log(req.params.id);
        Comments.findById(req.params.id, (err , content)=> {
            if(err) next(err) 
            if(content.userId.toString()=== req.user._id.toString()){
                next()
            }else{
                res.redirect('/users/login')
            }
        })
    }
}