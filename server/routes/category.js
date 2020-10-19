const express = require("express");

let { verifyToken, verifyRole } = require("..//middlewares/auth");

let app = express();

let Category = require("../models/category");

module.exports = app;

//show all categories
app.get("/category", (req, res) => {
  Category.find({})
    .sort("description")
    .populate("user", "name email role")
    .exec((err, categories) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        categories,
      });
    });
});

//show category by id
app.get("/category/:id", (req, res) => {
  let id = req.params.id;
  Category.findById(id, (err, categoryDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoryDb) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Categoría no encontrada",
        },
      });
    }
    res.json({
      ok: true,
      category: categoryDb,
    });
  });
});

app.post("/category", verifyToken, (req, res) => {
  //returns new category
  let body = req.body;

  let category = new Category({
    description: body.description,
    user: req.user._id,
  });
  console.log(req.user._id);

  category.save((err, categoryDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoryDb) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      category: categoryDb,
    });
  });
});

app.put("/category/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let description = { description: body.description };

  Category.findByIdAndUpdate(
    id,
    description,
    { new: true, runValidators: true },
    (err, categoryDb) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!categoryDb) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        category: categoryDb,
      });
    }
  );
});

app.delete("/category/:id", [verifyToken, verifyRole], (req, res) => {
  let id = req.params.id;

  Category.findByIdAndRemove(id, (err, categoryDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoryDb) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El ID no existte",
        },
      });
    }
    res.json({
      ok: true,
      message: "Categoría eliminada",
    });
  });
});
