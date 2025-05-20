const express = require("express");
const router = express.Router();
const User = require("../database/schema/userSchema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function getAllUsers(req, res) {
  const users = await User.find({}, "name email username image");
  return res.json({
    status: "success",
    data: users,
  });
}

async function getSingleUser(req, res) {
  const { username } = req.params;
  const user = await User.findOne({ username }, "name email username image");
  if (!user) {
    return res.status(400).json({
      status: "error",
      error: "No user found with this email",
    });
  }
  return res.json({
    status: "success",
    data: user,
  });
}

async function createUser(req, res) {
  const { name, email, password, username } = req.body;
  if (!name || !email || !password || !username) {
    return res.status(400).json({
      status: "error",
      error: "Please fill all the fields",
    });
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  // check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      status: "error",
      error: "User already exists with same email",
    });
  }

  const usernameMatch = await User.findOne({ username });
  if (usernameMatch) {
    return res.status(400).json({
      status: "error",
      error: "User already exists with same username",
    });
  }

  const newUser = new User({ name, email, password, token, username });

  await newUser
    .save()
    .then(() =>
      res.json({
        status: "success",
        data: "User created successfully",
      })
    )
    .catch((err) =>
      res.status(400).json({
        status: "error",
        error: err.message,
      })
    );
}

async function updateProfile(req, res) {
  const { name, image, username } = req.body;
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(400).json({
      status: "error",
      error: "authorization not found",
      header: req.headers,
    });
  const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
  return res.json({
    status: "success",
    data: decoded,
  });
  // const uname = decoded.email;
  // const user = await User.findOne({ uname });
  // if (!user) {
  //   return res.status(400).json({
  //     status: "error",
  //     error: "No user found with this email",
  //   });
  // }
  // user.name = name;
  // user.image = image;
  // user.username = username;
  // await user.save();
  // return res.json({
  //   status: "success",
  //   data: "Profile updated successfully",
  // });
}

async function changePassword(req, res) {
  const { email, oldPassword, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: "error",
      error: "No user found with this email",
    });
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({
      status: "error",
      error: "Please check your email and password",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.json({
    status: "success",
    data: "Password changed successfully",
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: "error",
      error: "No user found with this email",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      status: "error",
      error: "Please check your email and password ",
    });
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  user.token = token;
  await user.save();

  const retUser = {
    name: user.name,
    email: user.email,
    token: user.token,
    image: user.image,
    username: user?.username
  };
  return res.json({
    status: "success",
    data: retUser,
  });
}

router.route("/").get(getAllUsers).post(createUser).put(updateProfile);
router.route("/login").post(loginUser).put(changePassword);
router.route("/:username").get(getSingleUser);

module.exports = router;
