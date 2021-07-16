var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var cart = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    listItems: [
      {
        itemId: { type: Schema.Types.ObjectId, ref: "Items" },
        quantityProduct: { type: Number, default: 1, max:10 , min:1},
      },
    ],
  },
  {
    timestamps: true,
  }
);




module.exports = mongoose.model("Cart", cart);