const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
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

// ***************** mongodb connection **************
MongoClient.connect(
	dbConnectorStr,
	{ useUnifiedTopology: true }
	// ,{ useNewUrlParser: true }
)
	.then((client) => {
		console.log(`Connected to ${dbName} database`);
		db = client.db(dbName);
		const questions = db.collection("questions");

		// ************** DB Commands *******************

		app.post("/addquestion", (req, res) => {
			const body = req.body;
			const question = {
				question: body.question,
				answer: body.answer,
				answered: body.answered,
				values: body.values,
			};
			questions
				.insertOne(question)
				.then((res) => {
					console.log(`New Question ${question.question} added`);
					res.json({ response: "question added" });
				})
				.catch((error) => console.error(error));
		});

		app.get("/api/id/:id", (req, res) => {
			const id = req.params.id;
			// questions.find({id: values})
			questions
				.find({ "_id": ObjectId(`${id}`) })
				.toArray()
				.then((results) => {
					console.log(`{ _id : ObjectID(${id}) }`);
					console.log(results);
					res.json(results);
				})
				.catch((err) => {
					console.log(err);
				});
		});

		app.get("/api/values/:value", (req, res) => {
			const value = req.params.value.toLowerCase();
			questions
				.find({ "values": { $all: [`${value}`] } })
				.toArray()
				.then((results) => {
					console.log(results);
					res.json(results);
				})
				.catch((err) => {
					console.log(err);
				});
		});

		app.get("/random", (req, res) => {
			questions
				.aggregate([{ $sample: { size: 1 } }])
				.then((results) => {
					console.log(results);
					res.json(results.question);
				})
				.catch((err) => {
					console.log(err);
				});
		});
	})
	.catch((err) => console.log(err));

// *************** API Event Listeners ****************888

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/public", (req, res) => {
	res.sendFile(__dirname + "/public");
});

let oldDb = [
	{
		"question":
			"Give me an example of the project or initiative that you started on your ownIt can be a non-business oneWhat prompted you to get started?✅",
		"answer": "Cause - Customer Review Analysis being ranked 1 Star",
		"answered": true,
		"values": [],
	},
	{
		"question":
			"Tell me about a time you had to work on several projects at onceHow did you handle this?✅",
		"answer": "Cause - New store builds in the UK",
		"answered": true,
		"values": [],
	},
	{
		"question":
			"Describe a situation in which you felt you had not communicated well enoughWhat did you do? How did you handle it?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about when you had to deal with conflict within your teamHow was the conflict solved? How did you handle that? How would you deal with it now?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Give me an example of a time you had to take a creative and unusual approach to solve a coding problemHow did this idea come to your mind? Why do you think it was unusual?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Describe a situation in which you worked diligently on a project and it did not produce the desired resultsWhy didn't you get the desired results? What did you learn from the experience? ✅",
		"answer":
			"Starfinder Character Picker - good idea, worked hard, technologically still quite naive, didn’t finish. Tech Debt Learned that I probably should have worked in a group for more value and that there is usually a better way of doing things - you just don’t know it yet. (get a second opinion if something seems laborious)",
		"answered": true,
		"values": [],
	},
	{
		"question":
			"Give an example of an important project goal you reached and how you achieved it",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Describe a situation in which you experienced difficulty in getting others to accept your ideas? What was your approach? How did this work? Were you able to successfully persuade someone to see things your way✅",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a situation when you were responsible for project planningDid everything go according to your plan? If not, then why and what kind of counteractions did you have to take? ✅",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a situation when you made a mistake at workWhat happened exactly and how did you deal with it? What steps did you take to improve the situation?✅",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a time when you worked with someone who was not completing his or her share of the workHow did you handle the situation? Did you discuss your concern with your coworker? With your manager? If yes, how did your coworker respond to your concern? What was your manager's response?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Describe a situation when you worked effectively under pressureHow did you feel when working under pressure? What was going on, and how did you get through it?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about yourself",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about your experience at 100Devs",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "What do you know about our company?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Why do you want to work for us?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Why are you interested in this opportunity?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about your dream job? What do you really want to do with your career?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me a time when you failed",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "What do you read on a regular basis?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "What's some critical feedback you've gotten recently?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give an example of a time when you made a mistake at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give me an example of a time when your team didn't have the required resources",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give me an example of a time where there was a disagreement within the team?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give me an example of a time where there was a disagreement?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give me an example of a time you saw another staff member make a mistake",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a bad situation that went on for far too long?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time when a team member approached you with an issue?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time when all hell broke loose?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time when you didn't have the required resources?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time you saw a project about to fail?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time you saw another staff member make a mistake?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time you were presented with feedback at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you give us an example of a time you were presented with personal feedback at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you please tell me about a time a customer had an unusual request?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me a time when you had to face an extremely difficult situation?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a area of your store that was underforming?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a member of management you have worked with in the past?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a situation when you didn't have the knowledge to complete the task assigned to you?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me about a time all hell broke loose?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me about a time there was low morale at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when a customer presented you with negative feedback?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when a staff member's personal life impacted their performance at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when a staff member's personal life impacted their performance at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when a team member misunderstood you?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when a team member or colleague misunderstood you?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when an inefficient process caused a problem?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when there was a disagreement between yourself and a colleague?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when you dealt with a difficult person?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time when you had to work closely with someone whose personality was different to yours?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time where you were faced an unexpected challenge?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time you had a disagreement with a customer?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time you saw another staff member make a mistake?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about a time you were left in a situation you'd never been in before?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me about an unhappy customer at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me about the last time something at work affected you emotionally",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me about the last time you made a mistake",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me about a time you didn't want to go to work ?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell me when a communication issue led to a misunderstanding?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Can you tell me when you last failed to achieve your targets?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us a time when a mistake you made affected other staff?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a disagreement with a client or customer?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a situation you'd never dealt with before until that point?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a staff member that underwent a significant change during their time with you",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time a customer became angry in the store?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when a staff member experienced a big failure?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when a staff member showed character flaws?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when company procedures didn't apply to a situation you were presented with?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when someone became unhappy at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when something at work affected you emotionally?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time when the team was presented with a problem?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time where a conflict with a co-worker caused friction?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about the last time a staff member came to you with a problem?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us an example of a time when the situation suddenly changed ?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us the names of two people who would be willing to act as your reference?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you describe the qualities of the person you work most closely with?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you give an example of a memorable customer experience in-store?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you give an example of the last time you didn't possess the needed skills?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you tell me about a time in the last month you experienced Customer Service?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you tell me about a time when you doubted your abilities?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Could you tell me about a time you saw someone upset at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you tell me about an area of your store that was underperforming?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Could you tell us about a person on your team?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Could you tell us about a time you saw underperformance at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Could you think of a time you saw someone upset at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Have you ever had a poor performer on your team?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Have you ever had to deal with a problem that couldn't be solved in-store?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about a member of your current team",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a mistake you've made which affected other staff",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a problem you didn't have the authority to deal with at the time",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about a situation when you ran out of time",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about a time when staff were demotivated",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a time when you were asked to take on something outside your area of responsibility",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a time you made a mistake which affected other staff",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about a time you made a significant mistake at work",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Tell me about a time you saw unprofessional behaviour at work",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a time you were faced with an impossible staff situation?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about a time your responsibilities got a little bit overwhelming",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about the last time your workday ended before all the work was complete",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell me about the most stressful situation you've ever been in?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Tell us about a time you saw unprofessional behaviour at work?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"What are your KPIs? Can you tell me about when you last failed to achieve your targets?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "What has been you biggest accomplishment?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"When was the last time a colleague came to you with a problem?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"When was the last time a colleague came to you with a problem?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "When was the last time you had a disagreement with your boss?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "When was the last time you had to make a difficult decision?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "When was the last time you made a mistake?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question": "Would you be able to describe a colleague of yours to me?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Would you be able to tell me about a time you saw unprofessional behaviour in your team?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
	{
		"question":
			"Can you tell us about a time where your working environment was detrimental to performance?",
		"answer": "answer",
		"answered": false,
		"values": [],
	},
];

app.listen(process.env.PORT || 3000, () => {
	console.log(`Your server is listening on port ${process.env.PORT || 3000}`);
});
