const gracefulShutdown = require("http-graceful-shutdown");
const express = require("express");
const app = express();
const db = require("./config/database");
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

module.exports = app.listen(process.env.PORT || 3000, () => {
	console.log(`Your server is listening on port ${process.env.PORT || 3000}`);
});
