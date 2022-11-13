const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ************** mongoose settings *************

const questionSchema = new Schema({
	question: String,
	values: [String]
});

const Question = mongoose.model("Question", questionSchema);

exports.Question = Question;
