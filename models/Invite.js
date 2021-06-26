const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["MEMBER", "ADMIN"],
    default: "MEMBER",
  },
});

const Invite = mongoose.model("Invite", inviteSchema);

module.exports = Invite;
