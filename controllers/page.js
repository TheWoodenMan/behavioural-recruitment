const models = require("../models/Question");
const Question = models.Question;

module.exports = {
	getIndex: (req, res) => {
		res.render("index.ejs");
	},
	getQuestionForm: (req, res) => {
		res.render("questionForm.ejs", {
			info: { "question": "" }
		});
	},
	getValues: (req, res) => {
		res.render("values.ejs", {
			info: { "question": "" }
		});
	},
	getRandom: (req, res) => {
		const data = "";
		res.render("random.ejs", { info: data });
	},
	getQuestionList: (req, res) => {
		Question.find()
			.then((data) => {
				res.render("questionList.ejs", { info: data });
			})
			.catch((err) => console.error(err));
	},
	getRandomSearch: (req, res) => {
		Question.aggregate()
			.sample(10)
			.then((data) => {
				res.render("random.ejs", { info: data });
			})
			.catch((err) => console.error(err));
	},
	getValueSearch: (req, res) => {
		body = req.query;
		console.log(body.value);
		Question.aggregate([
			{ $match: { "values": { $in: [`${body.value.toLowerCase()}`] } } }
		])
			.sample(10)
			.then((data) => {
				res.render("random.ejs", { info: data });
			})
			.catch((err) => console.error(err));
	},
	submitQuestion: (req, res) => {
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
	},
	deleteQuestion: async (req, res) => {
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
	}
};
