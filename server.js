const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const db = require("./config/database");
const Question = db.Question;
ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

// ************** express settings **************
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(logger("dev"));
app.use(cors());

// ************** DB Commands *******************

const connectDB = db.connectDB;

// Connect To Database
connectDB();

// ************** Routes ************************

const apiRoutes = require("./routes/api");
const pageRoutes = require("./routes/page");

app.use("/", pageRoutes);
app.use("/api", apiRoutes);

app.listen(process.env.PORT || 3000, () => {
	console.log(`Your server is listening on port ${process.env.PORT || 3000}`);
});
