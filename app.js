const databaseConfig = require("./config/database.config");
const middlewareConfig = require("./config/middleware.config");
const routesConfig = require("./config/routes.config");
const express = require("express");

var app = express();

databaseConfig.init();

middlewareConfig(app);

routesConfig(app);

module.exports = app;
