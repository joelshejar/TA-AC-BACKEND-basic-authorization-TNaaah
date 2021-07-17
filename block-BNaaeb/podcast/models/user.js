var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, unique: true },
    password: { type: String, minlength: 5 },
    avtar: { type: String },
    isAdmin: { type: Boolean, default: false },
    podcastId: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
    isBlock: { type: Boolean, default: false },

    category: {
      type: String,
      default: 'free',
      enum: ['free', 'vip', 'premium'],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});
userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

userSchema.pre('save', function (next) {
  if (this.email == 'ravindrarajpoot9628172@gmail.com' || this.email == 'ravindrarajpoot7983@gmail.com') {
    this.isAdmin = true;
    this.category = 'premium';
    next();
  } else {
    next();
  }
});
var User = mongoose.model('User', userSchema);

module.exports = User;