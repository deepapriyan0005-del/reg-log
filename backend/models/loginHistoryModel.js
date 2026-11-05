const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    loginAt: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      default: "Success"
    }
  },
  {
    timestamps: true
  }
);

const LoginHistory = mongoose.model(
  "LoginHistory",
  loginHistorySchema
);

module.exports = LoginHistory;