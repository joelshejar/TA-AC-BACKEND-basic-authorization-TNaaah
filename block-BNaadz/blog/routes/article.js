var express = require("express");
const { render } = require("../app");
var router = express.Router();
var Article = require("../models/Article");
var Comment = require("../models/Comment");
var Users = require("../models/Users");
var auth = require("../middleware/auth");

router.get("/", (req, res, next) => {
  console.log(req.user);
  var session = req.session.userId;
  Article.find({}, (err, content) => {
    if (err) next(err);
    Users.findById(session, (err, user) => {
      if (err) return next(err);
      return res.render("articles", {
        articles: content,
        session: session,
        user: user,
      });
    });
  });
});

router.get("/:id/detail", (req, res, next) => {
  var session = req.session.userId;
  Article.findById(req.params.id)
    .populate("comments")
    .exec((err, content) => {
      if (err) return next(err);
      res.render("detail", { data: content, session });
    });
});

router.use(auth.loggedInUser);

router.get("/new", (req, res, next) => {
  return res.render("newArticle");
});

router.post("/", (req, res, next) => {
  req.body.authorId = req.session.userId;
  Article.create(req.body, (err, content) => {
    if (err) return next(err);
    res.redirect("/article");
  });
});

router.get("/:slug/like", (req, res, next) => {
  let slug = req.params.slug;
  let id = req.session.userId;
  Article.findOne({ slug, like: { $in: id } }, (err, content) => {
    if (err) return next(err);
    let isAlreadyAdded = {
      $pull: { like: id },
    };
    if (!content) {
      isAlreadyAdded = {
        $push: { like: id },
      };
    }
    Article.findOneAndUpdate(
      { slug },
      { likes: content.likes },
      { new: true },
      (err, updateContent) => {
        if (err) return next(err);
        res.redirect("/article/" + updateContent._id + "/detail");
      }
    );
  });
});


router.get("/:slug/edit", (req, res, next) => {
    Article.findOne({ slug: req.params.slug }, (err, content) => {
    if (err) return next(err);
    if (content.authorId._id.toString() === req.user._id.toString()) {
      // console.log("hi");
      // Article.findOneAndUpdate(
      //   { slug: req.params.slug },
      //   { new: true },
      //   (err, updateContent) => {
      //     if (err) return next(err);
      //     console.log(updateContent, "update");
      //     res.render("editArticle", { data: updateContent });
      //   }
      // );
      res.render("editArticle", { data: content });
    } else {
      res.redirect("/users/login");
    }
  });




});

router.post("/:slug/edit", (req, res, next) => {
  Article.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true },
    (err, content) => {
      if (err) return next(err);
      console.log(content);
      res.redirect("/article/" + content.slug);
    }
  );
});

router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Article.findById(id, (err, content) => {
    if (err) return next(err);
    if (content.authorId._id.toString() === req.user._id.toString()) {
      Article.findByIdAndDelete(id, (err, content) => {
        if (err) return next(err);
        Comment.deleteMany({ articleId: id }, (err, content) => {
          if (err) return next(err);
          console.log(content);
          res.redirect("/article");
        });
      });
    } else {
      res.redirect("/users/login");
    }
  });
});

router.post("/:id/comment", (req, res, next) => {
  req.body.aticleId = req.params.id;
  req.body.userId = req.user._id;
  Comment.create(req.body, (err, content) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: content._id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect("/article/" + article.slug);
      }
    );
  });
});

router.get("/:slug", (req, res, next) => {
  var slug = req.params.slug;
  var session = req.session.userId;
  Article.findOne({ slug })
    .populate("comments")
    .exec((err, content) => {
      if (err) return next(err);
      res.render("detail", { data: content, session });
    });
});

module.exports = router;