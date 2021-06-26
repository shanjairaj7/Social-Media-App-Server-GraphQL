const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  invited: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["MEMBER", "ADMIN"],
    default: "MEMBER",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
