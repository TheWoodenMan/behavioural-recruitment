const models = require("../models/Question");
const Question = models.Question;

module.exports = {
	addOneQuestion: (req, res) => {
		const question = new Question({
			question: req.body.question,
			values: req.body.values
		});

		question
			.save()
			.then((response) => {
				const resJSON = {
					"New Question added": question.question,
					"With Values": question.values
				};
				console.log(response);
				console.log(resJSON);
				res.status(200);
				res.json(resJSON);
			})
			.catch((error) => console.error(error));
	},
	addManyQuestions: (req, res) => {
		let returnArray = [];
		const questionArray = req.body.array;

		console.log(questionArray);

		const createQuestion = (obj) => {
			// This helper function takes in an obj as an argument and replicates it's properties
			// to a new mongoose query, creating a new Question and returning it as a response.
			return new Question({
				question: obj.question,
				values: obj.values
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
	},
	deleteQuestionById: async (req, res) => {
		const id = req.params.id;
		try {
			await Question.findOneAndDelete({ "_id": id });
			res.status(200);
			res.json({ "status": `Question ${id} deleted` });
		} catch (err) {
			res.status(404);
			res.json({
				"status": `Question ${id} not found`,
				"error": err
			});
		}
	}
};
