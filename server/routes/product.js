const express = require("express");
let { verifyToken } = require("..//middlewares/auth");
let app = express();
let Product = require("../models/product");

// get products
app.get("/products", verifyToken, (req, res) => {
  let page = req.query.page || 1;
  let limit = req.query.limit;
  limit = Number(limit);
  page = Number(page);
  skipped = (page - 1) * limit;

  Product.find({ available: true })
    .skip(skipped)
    .limit(limit)
    .sort("name")
    .populate("category", "description")
    .populate("user", "name email")
    .exec((err, products) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        products,
      });
    });
});

// get products by id
app.get("/products/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  Product.findById(id)
    .populate("category", "description")
    .populate("user", "name email")
    .exec((err, productDB) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!productDB) {
        return res.status(400).json({
          ok: false,
          err: { message: "El ID no existe" },
        });
      }
      res.json({
        ok: true,
        product: productDB,
      });
    });
});

app.get("/products/search/:term", verifyToken, (req, res) => {
  let term = req.params.term;
  let regex = new RegExp(term, "i");
  Product.find({ name: regex })
    .populate("category", "description")
    .exec((err, productDB) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!productDB) {
        return res.status(400).json({
          ok: false,
          err: { message: "El ID no existe" },
        });
      }
      res.json({
        ok: true,
        product: productDB,
      });
    });
});

app.post("/products", verifyToken, (req, res) => {
  //returns new product
  let body = req.body;

  let product = new Product({
    name: body.name,
    price: body.price,
    description: body.description,
    category: body.category,
    user: req.user._id,
  });
  console.log(req.user._id);

  product.save((err, productDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productDb) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      product: productDb,
    });
  });
});

app.put("/products/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  Product.findById(id, (err, productDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productDb) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El ID no existe",
        },
      });
    }
    productDb.name = body.name ? body.name : productDb.name;
    productDb.price = body.price ? body.price : productDb.price;
    productDb.description = body.description
      ? body.description
      : productDb.description;
    productDb.available = body.available ? body.available : productDb.available;
    productDb.category = body.category ? body.category : productDb.category;

    productDb.save((err, productSave) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        product: productSave,
      });
    });
  });
});

app.delete("/products/:id", verifyToken, (req, res) => {
  let id = req.params.id;

  Product.findById(id, (err, productDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productDb) {
      return res.status(400).json({
        ok: false,
        err: "El ID no existe",
      });
    }

    productDb.available = false;
    productDb.save((err, productDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        product: productDB,
      });
    });
  });
});

module.exports = app;
