const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const User = require("../models/user");
const Product = require("../models/product");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

app.use(fileUpload());

app.put("/upload/:type/:id", (req, res) => {
  let { type, id } = req.params;
  let file = req.files.file;
  let filename = file.name.split(".");
  let extension = filename[filename.length - 1];

  if (!req.files)
    return res.status(400).json({
      ok: false,
      err: {
        message: "No files were uploaded",
      },
    });

  if (!validateType(type, extension)) {
    return res.status(400).json({
      ok: false,
      message: "Extensión o tipo no válido",
    });
  }
  var date = moment(new Date()).format("YYYYMMDDhhmmss");
  let imageName = `${id}-${date}.${extension}`;

  file.mv(`uploads/${type}/${imageName}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    switch (type) {
      case "products":
        updateProduct(id, res, imageName);
        break;
      case "users":
        updateUser(id, res, imageName);
        break;
      default:
      // code block
    }
  });
});

function updateUser(id, res, name) {
  User.findById(id, (err, userDb) => {
    if (err) {
      deleteFile("users", name);
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!userDb) {
      deleteFile("users", name);
      return res.status(400).json({
        ok: false,
        err: {
          message: "El Usuario no existe",
        },
      });
    }
    deleteFile("users", userDb.img);

    userDb.img = name;
    userDb.save((err, userSave) => {
      res.json({
        ok: true,
        user: userSave,
      });
    });
  });
}

function updateProduct(id, res, name) {
  Product.findById(id, (err, productDb) => {
    if (err) {
      deleteFile("products", name);
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productDb) {
      deleteFile("products", name);
      return res.status(400).json({
        ok: false,
        err: {
          message: "El Producto no existe",
        },
      });
    }
    deleteFile("products", productDb.img);

    productDb.img = name;
    productDb.save((err, productSave) => {
      res.json({
        ok: true,
        product: productSave,
      });
    });
  });
}

function deleteFile(type, filename) {
  let imagePath = path.resolve(__dirname, `../../uploads/${type}/${filename}`);
  fs.existsSync(imagePath) ? fs.unlinkSync(imagePath) : "";
}

let validateType = (type, ext) => {
  let validExtends = ["png", "jpg", "jpeg"];
  let validTypes = ["products", "users"];
  if (validExtends.indexOf(ext) < 0) {
    return false;
  }
  if (validTypes.indexOf(type) < 0) {
    return false;
  }
  return true;
};

module.exports = app;
