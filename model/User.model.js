const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');

//define schema for user data
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "A user must have a first name"],
    trim: true
  },
  lastname: {
    type: String,
    required: [true, "A user must have a last name"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "A user must have an e-mail"],
    unique: [true, "A user email must be unique"],
    lowercase: true,
    validate: [validator.isEmail, "Please, enter a valid email"],
    trim: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['basic', 'moderator', 'admin'],
    default: 'basic'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

});

//add a pre-hook function to the UserSchema. This function gets called before the user info is stored in the database
UserSchema.pre("save", async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

UserSchema.methods.isValidPassword = async function (
  currentPassword,
  storedUserPassword
) {
  return storedUserPassword ? await bcrypt.compare(currentPassword, storedUserPassword) : false;
};

//This method will chain a function that compares and validates the password.
UserSchema.methods.isValidPassword = async function (
  currentPassword,
  storedUserPassword
) {
  return await bcrypt.compare(currentPassword, storedUserPassword);
};

//create User model object
const User = mongoose.model("User", UserSchema);
module.exports = User;