const mongoose = require("mongoose");
//creating user schema to store user info in database
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //if teacher or student
  role: {
    type: String,
    default: "student",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
//creating model
const User = mongoose.model("User", UserSchema);
//exporting model
module.exports = User;
