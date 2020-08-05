require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//parse x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

let options = {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}

mongoose.connect(process.env.URLDB, options, (err, res) => {
    if (err) throw err;
    console.log('Base de datos conectada');
});


app.listen(process.env.PORT, () => {
    console.log('Listening port', process.env.PORT);
});