const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");

let dbConnectorStr = process.env.MONGO_URI,
	dbName = "questions";

// ************** mongoose settings *************

const mongooseOptions = {
	dbName: dbName
};

// ***************** mongodb connection **************

const connectDB = async () => {
	try {
		mongoose.connect(dbConnectorStr, mongooseOptions);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

exports.connectDB = connectDB;