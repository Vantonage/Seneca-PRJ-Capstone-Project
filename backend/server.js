// Import required modules
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Post = require("./models/postModel");
const Listing = require("./models/listingModel");
const Comment = require("./models/commentModel");
const Message = require("./models/messageModel");

// Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

require("./auth/passport");
const passport = require("passport");

// Authentication middleware for Jwt token
function authenticateJwt(req, res, next) {
  passport.authenticate("jwt", function (err, user, info) {
    if (err) return next(err);
    req.user = user;
    next();
  })(req, res, next);
}

// Routes
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne(
      {
        email: req.body.email,
        password: req.body.password,
      },
      { email: 1, password: 1 }
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      "secret",
      {
        expiresIn: "60m",
      }
    );

    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // enable cross-site usage of cookie
      maxAge: 1000 * 60 * 60,
    });

    return res.status(202).json({ status: "ok", token: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

app.post("/signup", async (req, res) => {
  const body = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  };

  if (req.body.empId && req.body.empId !== "") {
    body.empId = req.body.empId;
    body.role = 2;
    body.dailyRate = 10;
  }

  try {
    const empIds = await User.find({}, "empId");
    console.log(empIds);
    if (body.empId && empIds.some((empId) => empId.empId === body.empId)) {
      return res
        .status(409)
        .json({
          status: "error-empId",
          error: "Employee Id already registered. Please contact your manager.",
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: "Server error" });
  }

  try {
    const user = await User.create(body);
    res.status(200).json({
      status: "ok",
      user: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ status: "error-email", error: "Email already in use" });
    } else {
      console.log(error);
      res.status(500).send({ status: "error", error: "Server error" });
    }
  }
});

app.get("/isAuthenticated", authenticateJwt, async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ status: "error", message: "User is not authenticated" });
  }
  // return res.json({ message:`Hello ${req.user.firstName} ${req.user.lastName}!`});
  return res.status(202).json({
    message: `Hello ${req.user.firstName} ${req.user.lastName}!`,
    user: req.user,
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("jwtToken", {
    secure: true,
    sameSite: "none", // enable cross-site usage of cookie
  });
  return res.json({ status: "success", message: "Logged out successfully" });
});

app.post("/postComment", async (req, res) => {
  try {
    console.log(req.body);
    const comment = await Comment.create({
      comment: req.body.comment,
      postId: req.body.postId,
      name: req.body.name,
    });
    res.status(200).json({
      status: "ok",
      comment: comment,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", error: "Error when posting a comment" });
  }
});

app.post("/postMessage", async (req, res) => {
  try {
    console.log(req.body);
    const message = await Message.create({
      message: req.body.message,
      receiverId: req.body.receiverId,
      senderId: req.body.senderId,
      name: req.body.name,
    });
    res.status(200).json({
      status: "ok",
      message: message,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", error: "Error when posting a message" });
  }
});

app.post("/postBranch", async (req, res) => {
  try {
    let { base64 } = "";

    if (req.body.image && req.body.image.base64) {
      base64 = req.body.image.base64;
    }

    const post = await Post.create({
      name: req.body.name,
      description: req.body.description,
      image: base64,
      userId: req.body.userId,
      posterName: req.body.posterName,
    });

    res.status(200).json({
      status: "ok",
      post: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: "Server error" });
  }
});

app.put("/updateBranch", async (req, res) => {
  try {
    let { base64 } = "";

    if (req.body.image && req.body.image.base64) {
      base64 = req.body.image.base64;
    }

    const posting = await Post.updateOne(
      { _id: req.body.id },
      {
        name: req.body.name,
        description: req.body.description,
        image: base64,
      }
    );
    console.log("Updated posting titled: " + req.body.name, posting);
    res.send({ status: "ok", data: posting });
  } catch (err) {
    console.error("Error Updating posting!", err);
    res.status(500).json({ err: "Server error" });
  }
});

app.delete("/deletePost", async (req, res) => {
  try {
    const posting = await Post.deleteOne({ _id: req.body.postId });
    console.log("Deleted posting with id: " + req.body.postId, posting);
    res.send({ status: "ok", data: posting });
  } catch (err) {
    console.error("Error Deleting posting!", err);
    res.status(500).json({ err: "Server error when deleting posting" });
  }
});

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/getEmployees", async (req, res) => {
  try {
    const employees = await User.find({ role: 2 });
    res.send({ status: "ok", data: employees });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/getCustomers", async (req, res) => {
  try {
    const employees = await User.find({ role: 1 });
    res.send({ status: "ok", data: employees });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/getUserById", authenticateJwt, async (req, res) => {
  if (req.user) {
    try {
      const objectId = req.query.id; // Get the id value from the request query parameters

      const user = await User.findOne({ _id: objectId }, { password: 0 });
      console.log(user);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ status: "ok", user: user });
    } catch (error) {
      console.error("Error fetching post data for _id=" + req.query.id, error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
});

app.put("/updateUser", authenticateJwt, async (req, res) => {
  if (req.user) {
    console.log(req.body);
    const { id, ...fieldsToUpdate } = req.body; // Get the id and the fields to update from the request body
    console.log(`id to update ${id}`);
    console.log(`fields to update ${fieldsToUpdate}`);

    try {
      const result = await User.updateOne(
        { _id: id },
        { $set: fieldsToUpdate }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "User updated successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user", error);
      res.status(500).json({ message: "Error updating user" });
    }
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
});

app.delete("/deleteUser", authenticateJwt, async (req, res) => {
  if (req.user) {
    const { id } = req.body;
    console.log(id);

    try {
      const result = await User.deleteOne({ _id: id });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error deleting user", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
});

app.get("/getComments", async (req, res) => {
  try {
    const comment = await Comment.find({});
    console.log(comment);
    res.send({ status: "ok", data: comment });
  } catch (error) {
    console.error("Error fetching post data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/getMessages", async (req, res) => {
  try {
    const message = await Message.find({});
    console.log(message);
    res.send({ status: "ok", data: message });
  } catch (error) {
    console.error("Error fetching message data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/postBranch", async (req, res) => {
  try {
    const post = await Post.find({});
    res.send({ status: "ok", data: post });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/getPostById", async (req, res) => {
  try {
    const objectId = req.body.name; // Get the _id value from the request body
    console.log("Request reached /getPostById route");
    console.log("Request Body:", req.body); // Log the entire request body

    const post = await Post.findOne({ _id: objectId });
    console.log(post);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log(post);

    res.send({ status: "ok", data: post });
  } catch (error) {
    console.error("Error fetching post data for _id=" + req.body._id, error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/getPostsByUserId", async (req, res) => {
  try {
    const objectId = req.query.id; // Get the _id value from the request query parameters

    const posts = await Post.find({ userId: objectId }, `_id createdAt name`);
    console.log(posts);
    if (!posts) {
      return res.status(404).json({ error: "Posts not found" });
    }

    res.json({ status: "ok", posts: posts });
  } catch (error) {
    console.error("Error fetching post data for _id=" + req.query.id, error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/getListings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.send({ status: "ok", data: allListings });
  } catch (error) {
    console.error("Error fetching listing data", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/getListingById", async (req, res) => {
  try {
    const listing = await Listing.findOne({ _id: req.body.id });
    res.send({ status: "ok", data: listing });
  } catch (error) {
    console.error(
      "Error fetching liatinf data for id=" + req.body.title,
      error
    );
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/postListing", async (req, res) => {
  try {
    let { base64 } = "";

    if (req.body.imageSrc && req.body.imageSrc.base64) {
      base64 = req.body.imageSrc.base64;
    }

    const newListing = await Listing.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      posterEmail: req.body.posterEmail,
      quantity: req.body.quantity,
      image: base64,
    });
    console.log("Added new listing!", req.body);
    res.status(200).json({ status: "ok", listing: newListing });
  } catch (err) {
    console.error("Error Posting booking data", err);
    res.status(500).json({ err: "Server error" });
  }
});

app.put("/updateListing", async (req, res) => {
  try {
    const listing = await Listing.updateOne(
      { _id: req.body.id },
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
      }
    );
    console.log(
      "Updated listing titled: " + req.body.title + " id# " + req.body.id,
      listing
    );
    res.send({ status: "ok", data: listing });
  } catch (err) {
    console.error("Error Deleting listing!", err);
    res.status(500).json({ err: "Server error" });
  }
});

app.put("/updateListingQuantity", async (req, res) => {
  try {
    let newQuantity = 0;
    if (req.body.quantity && req.body.count) {
      newQuantity = req.body.quantity - req.body.count;
    }
    const listing = await Listing.updateOne(
      { title: req.body.title },
      {
        quantity: newQuantity,
      }
    );
    console.log("Updated listing quantity: " + req.body.title, listing);
    res.send({ status: "ok", data: listing });
  } catch (err) {
    console.error("Error Deleting listing!", err);
    res.status(500).json({ err: "Server error" });
  }
});

app.delete("/deleteListing", async (req, res) => {
  try {
    const listing = await Listing.deleteOne({ _id: req.body.id });
    console.log("Deleted listing id: " + req.body.id, listing);
    res.send({ status: "ok", data: listing });
  } catch (err) {
    console.error("Error Deleting listing!", err);
    res.status(500).json({ err: "Server error" });
  }
});

app.put("/addOrder", async (req, res) => {
  try {
    console.log(req.body);

    const userId = req.body.userId;
    const cart = req.body.cart;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the orders array
    user.orders.push(cart);

    // Save the updated user
    const updatedUser = await user.save();
    res.send({ status: "ok", data: updatedUser });
  } catch (err) {
    console.error("Error adding order to user!", err);
    res.status(500).json({ err: "Server error" });
  }
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to mongodb");
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("error connecting to mongodb", error.message);
  });
