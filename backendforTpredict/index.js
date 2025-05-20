const express = require("express");
const dotenv = require("dotenv");
const connectToMongoDB = require("./database/lib/connect.js");
const router = require("./router.js");
const app = express();


dotenv.config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(router);
