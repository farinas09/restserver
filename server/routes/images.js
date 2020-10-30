const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const { verifyToken, verifyAuthImg } = require("../middlewares/auth");

app.get("/images/:type/:img", verifyAuthImg, (req, res) => {
  let type = req.params.type;
  let img = req.params.img;

  let pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`);
  let noImage = path.resolve(__dirname, "../assets/no_image.png");

  fs.existsSync(pathImage) ? res.sendFile(pathImage) : res.sendFile(noImage);
  //res.sendFile(noImage);
});

module.exports = app;
