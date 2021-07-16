var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var users = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true , required: true},
    password: { type: String, minlength: 5 , required:true},
    city: { type: String },
  },
  {
    timestamps: true,
  }
);

users.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});


users.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password , this.password , (err , result) => {
    return cb(err , result);
  })
}



users.methods.fullName = function () {
    return `${this.firstname} ${this.lastname}`;
  };

module.exports = mongoose.model('Users' , users);