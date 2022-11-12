const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

// ************** express settings *************
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(logger("dev"));
app.use(cors());

let db,
	dbConnectorStr = process.env.MONGO_URI,
	dbName = "questions";

// ************** mongoose settings *************

const questionSchema = new Schema({
	question: String,
	values: [String]
});

const Question = mongoose.model("Question", questionSchema);

// ***************** mongodb connection **************

const mongooseOptions = {
	dbName: dbName
};

mongoose.connect(dbConnectorStr, mongooseOptions);

// ************** DB Commands *******************

// API listener - Add one question populated from the body of a POST request in JSON format
app.post("/questions/addone", (req, res) => {
	const body = req.body;
	const question = new Question({
		question: body.question,
		values: body.values
	});
	question
		.save()
		.then((response) => {
			console.log(`New Question added:`);
			console.log(question);
			res.status(200);
			res.send("New Question added: ");
			res.json(response);
		})
		.catch((error) => console.error(error));
});

// API Listener - add many questions as an array of objects
app.post("/questions/addmany", (req, res) => {
	let returnArray = [];
	const questionArray = req.body.array;

	console.log(questionArray);

	const createQuestion = (object) => {
		// This helper function takes in an object as an argument and applies it's properties
		// to a new mongoose query, creating a new Question and returning it as a response.
		return new Question({
			question: object.question,
			values: object.values
		});
	};

	questionArray.forEach((element) => {
		let question = createQuestion(element);

		question
			.save()
			.then((response) => {
				console.log(`New Question added:`, `${question.question}`);
				console.log(response);
				returnArray.push(response);
			})
			.catch((error) => console.error(error));
	});
	let returnObject = { "Added Questions": returnArray };
	res.status(200);
	res.json(returnObject);
});

// Express listener that turns a form request into a new question.
app.post("/submitQuestion", (req, res) => {
	const valuesString = req.body.values;
	const valuesArray = valuesString.split(",").map((element) => {
		return element.trim();
	});
	console.log(valuesArray);
	const question = new Question({
		question: req.body.question,
		values: valuesArray
	});

	question
		.save()
		.then((response) => {
			console.log(`New Question added:`);
			console.log(question);
			res.status(200);
			res.json(response);
		})
		.catch((error) => console.error(error));
});

// API listener - searches the db by id number and displays the matching document.
app.get("/questions/:id/", (req, res) => {
	const id = req.params.id;
	// questions.find({id: values})
	Question.find({ "_id": ObjectId(`${id}`) })
		.then((results) => {
			console.log(`{ _id : ObjectID(${id}) }`);
			console.log(results);
			res.status(200);
			res.json(results);
		})
		.catch((err) => {
			console.log(err);
		});
});

// receives the object in the body and replaces the id in the params
// with the new object.
app.post("/questions/:id/replace/", (req, res) => {
	const id = req.params.id;
	const body = req.body;
	// questions.find({id: values})
	Question.findOne({ "_id": ObjectId(`${id}`) })
		.replaceOne(body)
		.then((results) => {
			console.log(`{ _id : ObjectID(${id}) } Replaced`);
			console.log(results);
			res.status(200);
			res.json(results);
		})
		.catch((err) => {
			console.log(err);
		});
});

// searches for a question by id then replaces the values with the body of the request
app.post("/questions/:id/values/replace", (req, res) => {
	const id = req.params.id;
	const values = req.body.values;
	console.log(`values: ${values}`);
	// add the document to a variable
	// apply the new values to that document
	// save the document and return the results.
	const question = Question.findOne({ "_id": ObjectId(`${id}`) });
	console.log(question);
	question.values = values;

	Question.findOne({ "_id": ObjectId(`${id}`) })
		.replaceOne(question)
		.then((results) => {
			console.log(`{ _id : ObjectID(${id}) } Values updated`);
			console.log(results);
			res.status(200);
			res.json(results);
		})
		.catch((err) => {
			console.log(err);
		});
});

// searches the db values arrays and displays each full record that matches
// the leadership value search string
app.get("/questions/values/:value", (req, res) => {
	const value = req.params.value.toLowerCase();
	Question.find({ "values": { $all: [`${value}`] } })
		.then((results) => {
			console.log(results);
			res.status(200);
			res.json(results);
		})
		.catch((err) => {
			res.status(404);
			res.json({
				"status": `Questions with value ${req.params.value.toLowerCase()} not found`,
				"error": err
			});
		});
});

// Gets a random document from the db and returns only the question
app.get("/questions/random/pickone", (req, res) => {
	Question
		// pick one record at random and add to the aggregate pipeline
		.aggregate()
		.sample(1)
		.then((results) => {
			console.log(results);
			res.status(200);
			res.json(results[0]["question"]);
		})
		.catch((err) => {
			res.status(404);
			res.json({
				"status": `Question ${req.body.idFromJS} not found`,
				"error": err
			});
		});
});

app.delete("/deleteQuestion", async (req, res) => {
	console.log(`Delete: ${req.body.idFromJS}`);
	try {
		await Question.findOneAndDelete({ "_id": req.body.idFromJS });
		res.status(200);
		res.json({ "status": `Question ${req.body.idFromJS} deleted` });
	} catch (err) {
		res.status(404);
		res.json({
			"status": `Question ${req.body.idFromJS} not found`,
			"error": err
		});
	}
});

// *************** Express listeners to render pages with EJS *******************

app.get("/", (req, res) => {
	res.render(__dirname + "/index.ejs");
});

app.get("/list", (req, res) => {
	Question.find()
		.then((data) => {
			res.render(__dirname + "/list.ejs", { info: data });
		})
		.catch((err) => console.error(err));
});

app.get("/newQuestion", (req, res) => {
	Question.find()
		.then((data) => {
			res.render(__dirname + "/newQuestion.ejs", { info: data });
		})
		.catch((err) => console.error(err));
});

// randomly search 10 questions and display them.
app.get("/randomSearch", (req, res) => {
	Question.aggregate()
		.sample(10)
		.then((data) => {
			res.render(__dirname + "/list.ejs", { info: data });
		})
		.catch((err) => console.error(err));
});

app.get("/valueSearch", (req, res) => {
	body = req.query;
	console.log(body.value);
	Question.aggregate([
		{ $match: { "values": { $in: [`${body.value.toLowerCase()}`] } } }
	])
		.sample(10)
		.then((data) => {
			res.render(__dirname + "/list.ejs", { info: data });
		})
		.catch((err) => console.error(err));
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Your server is listening on port ${process.env.PORT || 3000}`);
});
