const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

//Set View Engine and Static Directory Path
app.use(express.static("public"));
app.set("view engine", "ejs");

//Import routes
const authRouter = require("./routes/authRouter");
const mainRouter = require("./routes/mainRouter");
const dbRouter = require("./routes/dbRouter");

//MiddleWares
app.use(cookieParser());
app.use(express.json());
app.use("/", authRouter);
app.use("/dashboard", mainRouter);
app.use("/database", dbRouter);

//Express Error Handler
app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).send({ error: "Invalid JSON Input!" });
  } else {
    next();
  }
});

let port = process.env.PORT || 3000;

app.get("*", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  return console.log(`Listening on localhost:${port}`);
});
