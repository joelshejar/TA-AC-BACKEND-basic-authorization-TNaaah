const Article = require('../models/Article')
let Users = require('../models/User')
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
            Users.findById(userId ,"email" ,  (err , user)=> {
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
    CommentInfo : (req, res, next)=> {
        Comment.findById(req.params.id, (err , content)=> {
            if(err) next(err) 
            if(content.userId._id.toString()=== req.user._id.toString()){
                next()
            }else{
                res.redirect('/users/login')
            }
        })
    }
}