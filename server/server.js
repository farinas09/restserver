require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

//parse x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes config
app.use(require("./routes/index"));

let options = {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
};

mongoose.connect(process.env.URLDB, options, (err, res) => {
  if (err) throw err;
  console.log("Database Conected");
});

app.use(express.static(path.resolve(__dirname, "../public")));

app.listen(5000, () => {
  console.log("Listening port", process.env.PORT);
});
