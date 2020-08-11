const express = require('express');
const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();



app.post('/auth', function(req, res) {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, userdb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!userdb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario! o contraseña incorrectos"
                }
            });
        }
        if (!bcrypt.compareSync(body.password, userdb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        }

        let token = jwt.sign({
            usuario: userdb
        }, process.env.SEED, { expiresIn: process.env.EXPIRES_TIME })
        res.json({
            ok: true,
            usuario: userdb,
            token
        });

    })

});



module.exports = app;