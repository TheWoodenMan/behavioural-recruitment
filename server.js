const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cors = require("cors");

// ************** express settings *************
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

let db,
	dbConnectorStr = process.env.MONGO_URI,
	dbName = "questions";

// ************** mongoose settings *************

const questionSchema = new Schema({
	question: String,
	answer: String,
	answered: Boolean,
	values: [String],
});

const Question = mongoose.model("Question", questionSchema);

// ***************** mongodb connection **************

const mongooseOptions = {
	dbName: dbName,
};

mongoose.connect(
	// MongoClient.connect(
	dbConnectorStr,
	// ,{ useUnifiedTopology: true }
	// ,{ useNewUrlParser: true }
	mongooseOptions
);
// .then((client) => {
// 	console.log(`Connected to ${dbName} database`);
// 	db = client.db(dbName);
// const questions = db.collection("questions");

// ************** DB Commands *******************

// Add one question populated from the body of a POST request in JSON format
app.post("/questions/addone", (req, res) => {
	const body = req.body;
	const question = new Question({
		question: body.question,
		answer: body.answer,
		answered: body.answered,
		values: body.values,
	});
	question
		.save()
		.then((res) => {
			console.log(`New Question added:`);
			console.log(question);

			// optional reporting, took it out because it's a little spammy.
			// console.table([
			// 	{ key: "question", value: `${question.question}` },
			// 	{ key: "", value: `${question.answer}` },
			// 	{ key: "answered", value: `${question.answered}` },
			// 	{ key: "values", value: `${question.values}` },
			// ]);
			res.json({
				questionAdded: true,
			});
		})
		.catch((error) => console.error(error));
});

app.post("/questions/addmany", (req, res) => {
	const body = req.body;
	const question = {
		question: body.question,
		answer: body.answer,
		answered: body.answered,
		values: body.values,
	};
	Question.insertOne(question)
		.then((res) => {
			console.log(`New Question added:`, "/n", `${question.question}`);
			res.json({ response: "question added" });
		})
		.catch((error) => console.error(error));
});

app.post("/submitQuestion", (req, res) => {
	const body = req.body;
	console.log(body);
	const question = new Question({
		question: body.question,
		answer: body.answer,
		answered: body.answered,
		values: body.values,
	});
	question
		.save()
		.then((res) => {
			console.log(`New Question added:`);
			console.log(question);
			res.json({
				questionAdded: true,
			});
		})
		.catch((error) => console.error(error));
});

// searches the db by id number and displays the matching document.
app.get("/questions/:id/", (req, res) => {
	const id = req.params.id;
	// questions.find({id: values})
	Question.find({ "_id": ObjectId(`${id}`) })
		.then((results) => {
			console.log(`{ _id : ObjectID(${id}) }`);
			console.log(results);
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
			res.json(results);
		})
		.catch((err) => {
			console.log(err);
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
			res.json(results[0]["question"]);
		})
		.catch((err) => {
			console.log(err);
		});
});

app.delete("/deleteQuestion"),
	(req, res) => {
		let responseText;
		const query = req.body.question;
		console.log(query);
		Question.deleteOne({
			"question": `${body.question}`,
		})
			.then((res) => {
				if (res.deletedCount === 1) {
					responseText = "Successfully deleted one document.";
				} else {
					responseText = "No documents matched the query. Deleted 0 documents.";
				}
				res.json(responseText);
				console.log(responseText);
			})
			.catch((err) => {
				console.error(err);
			});
	};

// *************** API Event Listeners *******************

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
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
		{ $match: { "values": { $in: [`${body.value.toLowerCase()}`] } } },
	])
		.sample(10)
		.then((data) => {
			res.render(__dirname + "/list.ejs", { info: data });
		})
		.catch((err) => console.error(err));
});

let valuesArray = [
	"accountability",
	"action orientation",
	"adaptability",
	"analytical",
	"approachability",
	"attentive",
	"belonging",
	"boldness",
	"care",
	"charity",
	"coaching",
	"collaboration",
	"commitment",
	"communication",
	"community",
	"composure",
	"courage",
	"creativity",
	"customer focus",
	"customer obsession",
	"decisiveness",
	"delight",
	"determination",
	"discipline",
	"diversity",
	"education",
	"empathy",
	"development",
	"ethics",
	"excellence",
	"factualness",
	"fast learning",
	"flexibility",
	"focus",
	"fun",
	"global",
	"humour",
	"growth",
	"hard work",
	"health",
	"honesty",
	"hospitality",
	"human",
	"humility",
	"idealism",
	"impact",
	"improvement",
	"independence",
	"innovation",
	"integrity",
	"leadership",
	"mindfulness",
	"openness",
	"optimistic",
	"passion",
	"principled",
	"professionalism",
	"quality",
	"quick thinking",
	"reactive",
	"resilience",
	"resourceful",
	"respect",
	"responsibility",
	"results oriented",
	"self aware",
	"sense of humour",
	"service",
	"simplicity",
	"speed",
	"sustainability",
	"transparency",
	"trust",
	"versatility",
];

let owo = {
	"question": "OwO",
	"answer": "OwO",
	"answered": true,
	"values": ["OwO", "OwO", "OwO", "OwO", "OwO"],
};

let oldDb = [
	{
		"question":
			"Give me an example of the project or initiative that you started on your own.  It can be a non-business one.  What prompted you to get started?",
		"answer": "Cause - Customer Review Analysis being ranked 1 Star",
		"answered": true,
		"values": [
			"flexibility",
			"honesty",
			"adaptability",
			"creativity",
			"hard work",
			"innovation",
			"passion",
			"resourceful",
		],
	},
	{
		"question":
			"Tell me about a time you had to work on several projects at once. How did you handle this?",
		"answer": "Cause - New store builds in the UK",
		"answered": true,
		"values": [
			"optimistic",
			"results oriented",
			"sense of humour",
			"speed",
			"versatility",
		],
	},
	{
		"question":
			"Describe a situation in which you felt you had not communicated well enough.  What did you do? How did you handle it?",
		"answer": "",
		"answered": false,
		"values": [
			"accountability",
			"communication",
			"humility",
			"openness",
			"responsibility",
			"self aware",
			"transparency",
		],
	},
	{
		"question":
			"Tell me about when you had to deal with conflict within your team. How was the conflict solved? How did you handle that? How would you deal with it now?",
		"answer": "",
		"answered": false,
		"values": [
			"communication",
			"composure",
			"empathy",
			"leadership",
			"professionalism",
			"reactive",
			"resilience",
			"responsibility",
		],
	},
	{
		"question":
			"Give me an example of a time you had to take a creative and unusual approach to solve a coding problemHow did this idea come to your mind? Why do you think it was unusual?",
		"answer": "",
		"answered": false,
		"values": [
			"adaptability",
			"creativity",
			"determination",
			"flexibility",
			"innovation",
			"quick thinking",
			"resourceful",
		],
	},
	{
		"question":
			"Describe a situation in which you worked diligently on a project and it did not produce the desired results.  Why didn't you get the desired results? What did you learn from the experience? ✅",
		"answer":
			"Starfinder Character Picker - good idea, worked hard, technologically still quite naive, didn’t finish. Tech Debt Learned that I probably should have worked in a group for more value and that there is usually a better way of doing things - you just don’t know it yet. (get a second opinion if something seems laborious)",
		"answered": true,
		"values": [
			"communication",
			"determination",
			"humility",
			"openness",
			"self aware",
		],
	},
	{
		"question":
			"Give an example of an important project goal you reached and how you achieved it",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Describe a situation in which you experienced difficulty in getting others to accept your ideas? What was your approach? How did this work? Were you able to successfully persuade someone to see things your way✅",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a situation when you were responsible for project planningDid everything go according to your plan? If not, then why and what kind of counteractions did you have to take? ✅",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a situation when you made a mistake at workWhat happened exactly and how did you deal with it? What steps did you take to improve the situation?✅",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a time when you worked with someone who was not completing his or her share of the workHow did you handle the situation? Did you discuss your concern with your coworker? With your manager? If yes, how did your coworker respond to your concern? What was your manager's response?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Describe a situation when you worked effectively under pressureHow did you feel when working under pressure? What was going on, and how did you get through it?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about yourself",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about your experience at 100Devs",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "What do you know about our company?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Why do you want to work for us?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Why are you interested in this opportunity?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about your dream job? What do you really want to do with your career?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me a time when you failed",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "What do you read on a regular basis?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "What's some critical feedback you've gotten recently?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give an example of a time when you made a mistake at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give me an example of a time when your team didn't have the required resources",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give me an example of a time where there was a disagreement within the team?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give me an example of a time where there was a disagreement?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give me an example of a time you saw another staff member make a mistake",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a bad situation that went on for far too long?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time when a team member approached you with an issue?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time when all hell broke loose?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time when you didn't have the required resources?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time you saw a project about to fail?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time you saw another staff member make a mistake?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time you were presented with feedback at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time you were presented with personal feedback at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you please tell me about a time a customer had an unusual request?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me a time when you had to face an extremely difficult situation?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a area of your store that was underforming?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a member of management you have worked with in the past?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a situation when you didn't have the knowledge to complete the task assigned to you?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me about a time all hell broke loose?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me about a time there was low morale at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when a customer presented you with negative feedback?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when a staff member's personal life impacted their performance at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when a staff member's personal life impacted their performance at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when a team member misunderstood you?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when a team member or colleague misunderstood you?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when an inefficient process caused a problem?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when there was a disagreement between yourself and a colleague?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when you dealt with a difficult person?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when you had to work closely with someone whose personality was different to yours?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time where you were faced an unexpected challenge?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time you had a disagreement with a customer?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time you saw another staff member make a mistake?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time you were left in a situation you'd never been in before?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me about an unhappy customer at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about the last time something at work affected you emotionally",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me about the last time you made a mistake",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me about a time you didn't want to go to work ?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me when a communication issue led to a misunderstanding?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me when you last failed to achieve your targets?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us a time when a mistake you made affected other staff?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a disagreement with a client or customer?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a situation you'd never dealt with before until that point?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a staff member that underwent a significant change during their time with you",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time a customer became angry in the store?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when a staff member experienced a big failure?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when a staff member showed character flaws?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when company procedures didn't apply to a situation you were presented with?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when someone became unhappy at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when something at work affected you emotionally?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when the team was presented with a problem?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time where a conflict with a co-worker caused friction?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about the last time a staff member came to you with a problem?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us an example of a time when the situation suddenly changed ?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us the names of two people who would be willing to act as your reference?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you describe the qualities of the person you work most closely with?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you give an example of a memorable customer experience in-store?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you give an example of the last time you didn't possess the needed skills?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you tell me about a time in the last month you experienced Customer Service?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you tell me about a time when you doubted your abilities?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Could you tell me about a time you saw someone upset at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you tell me about an area of your store that was underperforming?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Could you tell us about a person on your team?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you tell us about a time you saw underperformance at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Could you think of a time you saw someone upset at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Have you ever had a poor performer on your team?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Have you ever had to deal with a problem that couldn't be solved in-store?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about a member of your current team",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a mistake you've made which affected other staff",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a problem you didn't have the authority to deal with at the time",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about a situation when you ran out of time",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about a time when staff were demotivated",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a time when you were asked to take on something outside your area of responsibility",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a time you made a mistake which affected other staff",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about a time you made a significant mistake at work",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about a time you saw unprofessional behaviour at work",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a time you were faced with an impossible staff situation?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a time your responsibilities got a little bit overwhelming",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about the last time your workday ended before all the work was complete",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about the most stressful situation you've ever been in?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell us about a time you saw unprofessional behaviour at work?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"What are your KPIs? Can you tell me about when you last failed to achieve your targets?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "What has been you biggest accomplishment?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"When was the last time a colleague came to you with a problem?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"When was the last time a colleague came to you with a problem?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "When was the last time you had a disagreement with your boss?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "When was the last time you had to make a difficult decision?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "When was the last time you made a mistake?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question": "Would you be able to describe a colleague of yours to me?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Would you be able to tell me about a time you saw unprofessional behaviour in your team?",
		"answer": "",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time where your working environment was detrimental to performance?",
		"answer": "",
		"answered": false,
		"values": [],
	},
];

app.listen(process.env.PORT || 3000, () => {
	console.log(`Your server is listening on port ${process.env.PORT || 3000}`);
});
