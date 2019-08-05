const indexRouter = require("../routes/index");
const userRouter = require("../routes/user");
const loungeRouter = require("../routes/lounge");
const roomRouter = require("../routes/room");

// middleware function to check for logged-in users
var loginChecker = (req, res, next) => {
  if (req.session.userId && req.cookies.user_sid) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports = app => {
  app.use("/", indexRouter);
  app.use("/user", loginChecker, userRouter);
  app.use("/lounge", loginChecker, loungeRouter);
  app.use("/room", loginChecker, roomRouter);
  app.get(
    "/avatar/:filename",
    require("../controllers/user/profile.controller").urlAvatar
  );

  // This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
  // This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
  app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.userId) {
      res.clearCookie("user_sid");
    }
    next();
  });

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
};
