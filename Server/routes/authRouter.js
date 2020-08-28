const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { verifyToken } = require("../config/verifyToken");
const { addData, expiredToken, searchData } = require("../config/dbConfig");

router.get("/", (req, res) => {
  return res.render("index");
});

router.post("/signup", async (req, res) => {
  const user = await searchData("users", { username: req.body.username.toString().toLowerCase() });
  if (user.length > 0) return res.status(400).json({ error: "User already Exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const data = { username: req.body.username.toString().toLowerCase(), password: hashedPassword, status: "active" };

  try {
    await addData("users", data);
    return res.status(200).json({ message: "Registration Successful! Please Login !" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  //Check if user is in DataBase
  const user = await searchData("users", { username: req.body.username.toString().toLowerCase() });
  if (user.length < 1) return res.status(400).json({ error: "Invalid Username !" });

  //Check for valid password
  const validPassword = await bcrypt.compare(req.body.password, user[0].password);
  if (!validPassword) return res.status(400).json({ error: "Invalid Password !" });

  //If everything is valid Create and assign a token. Token Expires in 12 hours
  const accessToken = jwt.sign({ id: user[0]._id }, process.env.TOKEN_SECRET, {
    expiresIn: "43200s",
  });

  //Save accessToken to Client's Browser Cookie and Redirect to Dashboard
  res.cookie("accessToken", accessToken).status(200).json({ message: "You are Logged In !" });
  //res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" }).status(200).json({ message: "You are Logged In !" });
});

router.post("/logout", verifyToken, async (req, res) => {
  const token = req.cookies.accessToken;
  await expiredToken(token);
  return res.status(400).json({ error: "You are logged out!" });
});

module.exports = router;
