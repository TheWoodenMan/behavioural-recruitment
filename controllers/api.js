const db = require("../config/database");
const Question = db.Question;

module.exports = {
	addOneQuestion: (req, res) => {
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
	},
	addManyQuestions: (req, res) => {
		let returnArray = [];
		const questionArray = req.body.array;

		console.log(questionArray);

		const createQuestion = (object) => {
			// This helper function takes in an object as an argument and routerlies it's properties
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
	},
	getQuestionById: (req, res) => {
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
	},
	replaceQuestionById: (req, res) => {
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
	},
	replaceValuesByQuestionId: (req, res) => {
		const id = req.params.id;
		const values = req.body.values;
		console.log(`values: ${values}`);
		// add the document to a variable
		// routerly the new values to that document
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
	},
	getQuestionsByValue: (req, res) => {
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
	},
	getRandomQuestions: (req, res) => {
		Question
			// pick one record at random and add to the aggregate pipeline
			.aggregate()
			.sample(req.params.number)
			.then((results) => {
				console.log(results);
				res.status(200);
				res.json(results[0]);
			})
			.catch((err) => {
				res.status(404);
				res.json({
					"status": `Question ${req.body.idFromJS} not found`,
					"error": err
				});
			});
	}
};
