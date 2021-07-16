var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var item = new Schema(
  {
    name: { type: String, required: true },
    quantityOfProduct: { type: Number, required: true },
    price: { type: Number, required: true },
    adminId: {type: Schema.Types.ObjectId , ref: 'Users'},
    likes: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    catagories:{type:String , required:true},
    commentId: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    productImage: {type: String, required:true}
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Items' , item);