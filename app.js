var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var loungeRouter = require("./routes/lounge");
var roomRouter = require("./routes/room");

var app = express();

//database setup
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
let connStr = "mongodb://tiger:tiger123@localhost:27017/werewolf";
mongoose.connect(connStr, { useNewUrlParser: true }, err => {
  if (err) return console.log("Error:" + err);
  console.log("Connected database!");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//session setup
app.use(
  session({
    key: "user_sid",
    secret: "tiger team",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 168
    }
  })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.userId) {
    res.clearCookie("user_sid");
  }
  next();
});

// middleware function to check for logged-in users
var loginChecker = (req, res, next) => {
  if (req.session.userId && req.cookies.user_sid) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.use("/", indexRouter);
app.use("/user", loginChecker, userRouter);
app.use("/lounge", loginChecker, loungeRouter);
app.use("/room", loginChecker, roomRouter);
app.get(
  "/avatar/:filename",
  require("./controllers/user/profile.controller").urlAvatar
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
