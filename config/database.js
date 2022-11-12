const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let dbConnectorStr = process.env.MONGO_URI,
	dbName = "questions";

// ************** mongoose settings *************

const questionSchema = new Schema({
	question: String,
	values: [String]
});

const Question = mongoose.model("Question", questionSchema);

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
exports.Question = Question;
