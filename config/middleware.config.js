const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const favicon = require("serve-favicon");

module.exports = app => {
  // view engine setup
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "pug");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "../public")));
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    next();
  });

  app.use(
    favicon(path.join(__dirname, "../public", "images", "werewolflogo.png"))
  );

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
};
