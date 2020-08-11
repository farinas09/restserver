const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verifyToken, verifyRole } = require('../middlewares/auth');
const app = express();

app.get('/usuario', verifyToken, (req, res) => {
    let page = req.query.page || 0;
    let limit = req.query.limit || 5;
    limit = Number(limit);
    page = Number(page);
    skipped = (page - 1) * 5;
    Usuario.find({ state: true }, 'nombre email google state img')
        .skip(skipped)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ state: true }, (err, cant) => {
                res.json({
                    ok: true,
                    cant,
                    users
                });
            })

        })
});

app.post('/usuario', [verifyToken, verifyRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            "usuario": usuarioDB
        });
    });


});

app.put('/usuario/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'state']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (usuarioDB === null) {
            return res.status(400).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }
        res.json({
            ok: true,
            "usuario": usuarioDB
        });
    });

});




app.delete('/usuario/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;

    /*Usuario.findByIdAndRemove(id, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (user == null) {
            return res.status(400).json({
                ok: false,
                err: "Usuario no encontrado"
            });
        }
        res.json({
            ok: true,
            "usuario": user
        });
    })*/

    Usuario.findByIdAndUpdate(id, { state: "false" }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (usuarioDB == null) {
            return res.status(400).json({
                ok: false,
                err: "Usuario no encontrado"
            });
        }
        res.json({
            ok: true,
            "usuario": usuarioDB
        });
    });
});

module.exports = app;