var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userMediaSchema = new Schema(
  {
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    types: { type: String, default: 'free', enum: ['free', 'vip', 'premium'] },
    file: { type: String },
    likes: { type: String, default: 0 },
  },
  { timestamps: true }
);

var UserMedia = mongoose.model('UserMedia', userMediaSchema);

module.exports = UserMedia;