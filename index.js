const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/message", (req, res) => {
  console.log("got ya");
  console.log(req.body);
});

app.listen(3000, () => {
  console.log("listenin");
});
