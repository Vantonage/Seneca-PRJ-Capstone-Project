const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [
        true,
        "Email already associated with another account. Please use another email.",
      ],
    },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    shippingAddress: { type: String },
    // paymentMethod: { type: String },    // take out
    // paymentInfo: { type: String }, // not sure about this atm,
    // posts: { type: Array },     // take out
    orders: { type: Array },
    profileImage: { type: String },
    bio: { type: String, default: "Hello everyone!" },
    dailyRate: { type: Number, min: [10, "Daily rate cannot be less than 0"] }, // take out
    role: { type: Number, default: 1 }, // 1 = customer, 2 = employee, 0 = admin
    empId: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = model("Users", userSchema);

module.exports = User;
