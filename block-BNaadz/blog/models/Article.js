var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var articles = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: [{type: Schema.Types.ObjectId, ref:'Users'}],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    author: { type: String, required: true },
    slug: String,
    authorId: {type: Schema.Types.ObjectId , ref: 'Users' , required:true},
  },
  {
    timestamps: true,
  }
);

articles.pre("save", function (next) {
  let random = Math.floor(Math.random() * 10);
  let str = this.title.split(" ").join("-").trim().concat(random);
  this.slug = str;
  next();
});

module.exports = mongoose.model("Articles", articles);