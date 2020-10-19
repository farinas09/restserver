const express = require("express");
const app = express();

app.use(require("./user"));
app.use(require("./auth"));
app.use(require("./category"));
app.use(require("./product"));

module.exports = app;
