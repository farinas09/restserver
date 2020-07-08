require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//parse x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.json('get usuario')
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            message: 'Name is required'
        });
    } else {
        res.json({
            "data": body
        });
    }
});

app.put('/usuario', function(req, res) {
    res.json('put usuario')
});


app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
});

app.listen(process.env.PORT, () => {
    console.log('Listening port', process.env.PORT);
});