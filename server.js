const express = require("express");
const app = express();
let mongoose;
require("dotenv").config();
const bodyParser = require("body-parser");

try {
	mongoose = require("mongoose");
} catch (e) {
	console.log(e);
}
const Schema = mongoose.Schema;

try {
	mongoose.connect(
		process.env.MONGO_URI,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		() => console.log("Mongoose is connected")
	);
} catch {
	console.log("Could not connect");
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// *************** API Event Listeners ****************888

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/public", (req, res) => {
	res.sendFile(__dirname + "/public");
});

app.get("/api/:questionID", (req, res) => {
	const questionID = req.params.questionID;
	if (questions[questionID]) {
		res.json(questions[questionID].question);
	} else {
		res.json(questions[0]);
	}
});

app.get("/random", (req, res) => {
	const questionID = Math.ceil(Math.random() * questions.length);
	res.json(questions[questionID].question);
});

// ************** DB Commands *******************

app.get("/addquestion", function (req, res, next) {
	// in case of incorrect function use wait timeout then respond
	let t = setTimeout(() => {
		next({ message: "timeout" });
	}, TIMEOUT);
	createAndSaveQuestion(function (err, data) {
		clearTimeout(t);
		if (err) {
			return next(err);
		}
		if (!data) {
			console.log("Missing `done()` argument");
			return next({ message: "Missing callback argument" });
		}
		Question.findById(data._id, function (err, question) {
			if (err) {
				return next(err);
			}
			res.json(question);
		});
	});
});

// ************* Mongoose Configuration ********************

const questionSchema = new Schema({
	_id: Number,
	question: String,
	answer: String,
	answered: Boolean,
	values: [String],
});

// compiled model
const Question = mongoose.model("Question", questionSchema);

// module.exports = mongoose.model("Question", questionSchema);

// ******************* Mongoose Functions **************************

// function to create and save a new Person

const createAndSaveQuestion = (body) => {
	// create a new document instance using the Person model constructor
	const question = new Question({
		_id: body._id,
		question: body.question,
		answer: body.answer,
		answered: body.answered,
		values: body.values,
	});

	// call the method document.save() on the returned document instance
	question.save(function (err, data) {
		if (err) return console.error(err);
		done(null, data);
	});
};

let questions = [
	{
		"_id": 0,
		"question":
			"Question must be in the format - Can you give me an example of a time when X? Don't be tempted to lead",
		"answer":
			"Answer with CAR - Cause, Action, Result.  Don't use hypotheticals, don't generalise - think of a specific example",
		"answered": "TRUE",
		"values": [],
	},
	{
		"_id": 1,
		"question":
			"Give me an example of the project or initiative that you started on your ownIt can be a non-business oneWhat prompted you to get started?✅",
		"answer": "Cause - Customer Review Analysis being ranked 1 Star",
		"answered": "TRUE",
		"values": [],
	},
	{
		"_id": 2,
		"question":
			"Tell me about a time you had to work on several projects at onceHow did you handle this?✅",
		"answer": "Cause - New store builds in the UK",
		"answered": "TRUE",
		"values": [],
	},
	{
		"_id": 3,
		"question":
			"Describe a situation in which you felt you had not communicated well enoughWhat did you do? How did you handle it?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 4,
		"question":
			"Tell me about when you had to deal with conflict within your teamHow was the conflict solved? How did you handle that? How would you deal with it now?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 5,
		"question":
			"Give me an example of a time you had to take a creative and unusual approach to solve a coding problemHow did this idea come to your mind? Why do you think it was unusual?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 6,
		"question":
			"Describe a situation in which you worked diligently on a project and it did not produce the desired resultsWhy didn't you get the desired results? What did you learn from the experience? ✅",
		"answer":
			"Starfinder Character Picker - good idea, worked hard, technologically still quite naive, didn’t finish. Tech Debt Learned that I probably should have worked in a group for more value and that there is usually a better way of doing things - you just don’t know it yet. (get a second opinion if something seems laborious)",
		"answered": "TRUE",
		"values": [],
	},
	{
		"_id": 7,
		"question":
			"Give an example of an important project goal you reached and how you achieved it",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 8,
		"question":
			"Describe a situation in which you experienced difficulty in getting others to accept your ideas? What was your approach? How did this work? Were you able to successfully persuade someone to see things your way✅",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 9,
		"question":
			"Tell me about a situation when you were responsible for project planningDid everything go according to your plan? If not, then why and what kind of counteractions did you have to take? ✅",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 10,
		"question":
			"Tell me about a situation when you made a mistake at workWhat happened exactly and how did you deal with it? What steps did you take to improve the situation?✅",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 11,
		"question":
			"Tell me about a time when you worked with someone who was not completing his or her share of the workHow did you handle the situation? Did you discuss your concern with your coworker? With your manager? If yes, how did your coworker respond to your concern? What was your manager's response?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 12,
		"question":
			"Describe a situation when you worked effectively under pressureHow did you feel when working under pressure? What was going on, and how did you get through it?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 13,
		"question": "Tell me about yourself",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 14,
		"question": "Tell me about your experience at 100Devs",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 15,
		"question": "What do you know about our company?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 16,
		"question": "Why do you want to work for us?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 17,
		"question": "Why are you interested in this opportunity?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 18,
		"question":
			"Tell me about your dream job? What do you really want to do with your career?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 19,
		"question": "Tell me a time when you failed",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 20,
		"question": "What do you read on a regular basis?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 21,
		"question": "What's some critical feedback you've gotten recently?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 22,
		"question":
			"Can you give an example of a time when you made a mistake at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 23,
		"question":
			"Can you give me an example of a time when your team didn't have the required resources",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 24,
		"question":
			"Can you give me an example of a time where there was a disagreement within the team?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 25,
		"question":
			"Can you give me an example of a time where there was a disagreement?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 26,
		"question":
			"Can you give me an example of a time you saw another staff member make a mistake",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 27,
		"question":
			"Can you give us an example of a bad situation that went on for far too long?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 28,
		"question":
			"Can you give us an example of a time when a team member approached you with an issue?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 29,
		"question":
			"Can you give us an example of a time when all hell broke loose?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 30,
		"question":
			"Can you give us an example of a time when you didn't have the required resources?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 31,
		"question":
			"Can you give us an example of a time you saw a project about to fail?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 32,
		"question":
			"Can you give us an example of a time you saw another staff member make a mistake?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 33,
		"question":
			"Can you give us an example of a time you were presented with feedback at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 34,
		"question":
			"Can you give us an example of a time you were presented with personal feedback at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 35,
		"question":
			"Can you please tell me about a time a customer had an unusual request?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 36,
		"question":
			"Can you tell me a time when you had to face an extremely difficult situation?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 37,
		"question":
			"Can you tell me about a area of your store that was underforming?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 38,
		"question":
			"Can you tell me about a member of management you have worked with in the past?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 39,
		"question":
			"Can you tell me about a situation when you didn't have the knowledge to complete the task assigned to you?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 40,
		"question": "Can you tell me about a time all hell broke loose?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 41,
		"question": "Can you tell me about a time there was low morale at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 42,
		"question":
			"Can you tell me about a time when a customer presented you with negative feedback?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 43,
		"question":
			"Can you tell me about a time when a staff member's personal life impacted their performance at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 44,
		"question":
			"Can you tell me about a time when a staff member's personal life impacted their performance at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 45,
		"question":
			"Can you tell me about a time when a team member misunderstood you?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 46,
		"question":
			"Can you tell me about a time when a team member or colleague misunderstood you?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 47,
		"question":
			"Can you tell me about a time when an inefficient process caused a problem?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 48,
		"question":
			"Can you tell me about a time when there was a disagreement between yourself and a colleague?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 49,
		"question":
			"Can you tell me about a time when you dealt with a difficult person?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 50,
		"question":
			"Can you tell me about a time when you had to work closely with someone whose personality was different to yours?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 51,
		"question":
			"Can you tell me about a time where you were faced an unexpected challenge?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 52,
		"question":
			"Can you tell me about a time you had a disagreement with a customer?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 53,
		"question":
			"Can you tell me about a time you saw another staff member make a mistake?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 54,
		"question":
			"Can you tell me about a time you were left in a situation you'd never been in before?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 55,
		"question": "Can you tell me about an unhappy customer at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 56,
		"question":
			"Can you tell me about the last time something at work affected you emotionally",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 57,
		"question": "Can you tell me about the last time you made a mistake",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 58,
		"question": "Can you tell me about a time you didn't want to go to work ?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 59,
		"question":
			"Can you tell me when a communication issue led to a misunderstanding?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 60,
		"question": "Can you tell me when you last failed to achieve your targets?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 61,
		"question":
			"Can you tell us a time when a mistake you made affected other staff?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 62,
		"question":
			"Can you tell us about a disagreement with a client or customer?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 63,
		"question":
			"Can you tell us about a situation you'd never dealt with before until that point?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 64,
		"question":
			"Can you tell us about a staff member that underwent a significant change during their time with you",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 65,
		"question":
			"Can you tell us about a time a customer became angry in the store?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 66,
		"question":
			"Can you tell us about a time when a staff member experienced a big failure?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 67,
		"question":
			"Can you tell us about a time when a staff member showed character flaws?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 68,
		"question":
			"Can you tell us about a time when company procedures didn't apply to a situation you were presented with?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 69,
		"question":
			"Can you tell us about a time when someone became unhappy at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 70,
		"question":
			"Can you tell us about a time when something at work affected you emotionally?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 71,
		"question":
			"Can you tell us about a time when the team was presented with a problem?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 72,
		"question":
			"Can you tell us about a time where a conflict with a co-worker caused friction?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 73,
		"question":
			"Can you tell us about the last time a staff member came to you with a problem?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 74,
		"question":
			"Can you tell us an example of a time when the situation suddenly changed ?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 75,
		"question":
			"Can you tell us the names of two people who would be willing to act as your reference?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 76,
		"question":
			"Could you describe the qualities of the person you work most closely with?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 77,
		"question":
			"Could you give an example of a memorable customer experience in-store?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 78,
		"question":
			"Could you give an example of the last time you didn't possess the needed skills?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 79,
		"question":
			"Could you tell me about a time in the last month you experienced Customer Service?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 80,
		"question":
			"Could you tell me about a time when you doubted your abilities?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 81,
		"question": "Could you tell me about a time you saw someone upset at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 82,
		"question":
			"Could you tell me about an area of your store that was underperforming?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 83,
		"question": "Could you tell us about a person on your team?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 84,
		"question":
			"Could you tell us about a time you saw underperformance at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 85,
		"question": "Could you think of a time you saw someone upset at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 86,
		"question": "Have you ever had a poor performer on your team?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 87,
		"question":
			"Have you ever had to deal with a problem that couldn't be solved in-store?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 88,
		"question": "Tell me about a member of your current team",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 89,
		"question":
			"Tell me about a mistake you've made which affected other staff",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 90,
		"question":
			"Tell me about a problem you didn't have the authority to deal with at the time",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 91,
		"question": "Tell me about a situation when you ran out of time",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 92,
		"question": "Tell me about a time when staff were demotivated",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 93,
		"question":
			"Tell me about a time when you were asked to take on something outside your area of responsibility",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 94,
		"question":
			"Tell me about a time you made a mistake which affected other staff",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 95,
		"question": "Tell me about a time you made a significant mistake at work",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 96,
		"question": "Tell me about a time you saw unprofessional behaviour at work",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 97,
		"question":
			"Tell me about a time you were faced with an impossible staff situation?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 98,
		"question":
			"Tell me about a time your responsibilities got a little bit overwhelming",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 99,
		"question":
			"Tell me about the last time your workday ended before all the work was complete",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 100,
		"question":
			"Tell me about the most stressful situation you've ever been in?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 101,
		"question":
			"Tell us about a time you saw unprofessional behaviour at work?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 102,
		"question":
			"What where your key objectives on your last team? Can you tell me about when you last failed to achieve your targets?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 103,
		"question": "What has been your biggest accomplishment?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 104,
		"question":
			"When was the last time a colleague came to you with a problem?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 105,
		"question":
			"When was the last time you had a problem you couldn't solve on your own?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 106,
		"question": "When was the last time you had a disagreement with your boss?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 107,
		"question": "When was the last time you had to make a difficult decision?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 108,
		"question": "When was the last time you made a mistake?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 109,
		"question": "Would you be able to describe a colleague of yours to me?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 110,
		"question":
			"Would you be able to tell me about a time you saw unprofessional behaviour in your team?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
	{
		"_id": 111,
		"question":
			"Can you tell us about a time where the working environment was detrimental to performance?",
		"answer": "answer",
		"answered": "FALSE",
		"values": [],
	},
];

app.listen(process.env.PORT || 3000, () => {
	console.log(`Your server is listening on port ${process.env.PORT || 3000}`);
});
