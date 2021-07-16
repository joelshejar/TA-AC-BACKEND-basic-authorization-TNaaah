var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var comment = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    userId : {type: Schema.Types.ObjectId, ref: "Users", required: true},
    like:[{type:Schema.Types.ObjectId , ref:'Users'}],
    aticleId: { type: Schema.Types.ObjectId, ref: "Article" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment' , comment);