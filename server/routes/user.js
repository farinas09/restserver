const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const User = require("../models/user");
const { verifyToken, verifyRole } = require("../middlewares/auth");
const app = express();

app.get("/user", verifyToken, (req, res) => {
  let page = req.query.page || 1;
  let limit = req.query.limit;
  limit = Number(limit);
  page = Number(page);
  skipped = (page - 1) * limit;
  User.find({ state: true }, "name email google state img")
    .skip(skipped)
    .limit(limit)
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      User.countDocuments({ state: true }, (err, cant) => {
        res.json({
          ok: true,
          cant,
          users,
        });
      });
    });
});

app.post("/user", [verifyToken, verifyRole], (req, res) => {
  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      user: userDB,
    });
  });
});

app.put("/user/:id", [verifyToken, verifyRole], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["name", "email", "img", "role", "state"]);

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, userDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (userDB === null) {
        return res.status(400).json({
          ok: false,
          message: "User no encontrado",
        });
      }
      res.json({
        ok: true,
        user: userDB,
      });
    }
  );
});

app.delete("/user/:id", [verifyToken, verifyRole], (req, res) => {
  let id = req.params.id;

  /*User.findByIdAndRemove(id, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (user == null) {
            return res.status(400).json({
                ok: false,
                err: "User no encontrado"
            });
        }
        res.json({
            ok: true,
            "user": user
        });
    })*/

  User.findByIdAndUpdate(
    id,
    { state: "false" },
    { new: true },
    (err, userDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (userDB == null) {
        return res.status(400).json({
          ok: false,
          err: "User no encontrado",
        });
      }
      res.json({
        ok: true,
        user: userDB,
      });
    }
  );
});

module.exports = app;
