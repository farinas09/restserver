const express = require("express");
const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

app.post("/auth", function (req, res) {
  let body = req.body;
  User.findOne({ email: body.email }, (err, userdb) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!userdb) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "User! o contraseña incorrectos",
        },
      });
    }
    if (!bcrypt.compareSync(body.password, userdb.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "User o contraseña incorrectos",
        },
      });
    }

    let token = jwt.sign(
      {
        user: userdb,
      },
      process.env.SEED,
      { expiresIn: process.env.EXPIRES_TIME }
    );
    res.json({
      ok: true,
      user: userdb,
      token,
    });
  });
});

//google settings
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  console.log(payload.email);
  console.log(payload.name);
  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

app.post("/google_auth", async (req, res) => {
  let token = req.body.idtoken;
  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      ok: false,
      err: e,
    });
  });

  User.findOne({ email: googleUser.email }, (err, userdb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (userdb) {
      if (userdb.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Este correo ya está en uso con autenticación normal",
          },
        });
      } else {
        let token = jwt.sign(
          {
            user: userdb,
          },
          process.env.SEED,
          { expiresIn: process.env.EXPIRES_TIME }
        );
        return res.json({
          ok: true,
          user: userdb,
          token,
        });
      }
    } else {
      //new user
      let user = new User({
        name: googleUser.name,
        email: googleUser.email,
        img: googleUser.img,
        google: true,
        password: ":)",
      });
      user.save((err, userdb) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        let token = jwt.sign(
          {
            user: userdb,
          },
          process.env.SEED,
          { expiresIn: process.env.EXPIRES_TIME }
        );

        return res.json({
          ok: true,
          user: userdb,
          token,
        });
      });
    }
  });
});

module.exports = app;
