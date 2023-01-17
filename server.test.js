const request = require("supertest");
const app = require("./server");
const db = require("./config/database");
const mongoose = require("mongoose");
const { response } = require("express");

describe("Load Pages", () => {
	afterAll(() => {
		mongoose.disconnect();
	});

	test("GET / should return and render index.ejs to html", (done) => {
		const res = request(app.server)
			.get("/")
			.expect("Content-Type", /text\/html/)
			.expect(200)
			.end(done);
	});
	test("GET /random should return random.ejs", (done) => {
		const res = request(app.server)
			.get("/random")
			.expect("Content-Type", /text\/html/)
			.expect(200)
			.end(done);
	});
	test("GET /values should return values.ejs", (done) => {
		const res = request(app.server)
			.get("/values")
			.expect("Content-Type", /text\/html/)
			.expect(200)
			.end(done);
	}, 10000);
	test("GET /questionForm should return questionForm.ejs", (done) => {
		const res = request(app.server)
			.get("/questionForm")
			.expect("Content-Type", /text\/html/)
			.expect(200)
			.end(done);
	}, 10000);
});

describe("GET Random Page Functions", (done) => {
	test("GET /randomSearch should return up to 10 random records, then re-render the page", () => {
		const response = request(app.server)
			.get("/randomSearch")
			.expect("Content-Type", /text\/html/)
			.expect(200)
			.end(function (err, res) {
				if (err) throw err;
			});
	}, 10000);
});

describe("POST Page Functions", () => {
	test("POST /submitQuestion with a question in the body should create a new Question documents", () => {
		const response = request(app.server)
			.post("/submitQuestion")
			.send({ "question": "test", "values": ["test"] })
			.expect("Content-Type", /text\/html/)
			.expect(200)
			.end(function (err, res) {
				if (err) throw err;
			});
	});
});

describe("DELETE Page Functions", () => {
	test("DELETE /deleteQuestion should delete a question by id after button push", () => {});
});

let testID;

describe("Restricted API Calls POST", () => {
	test("POST /api/questions/addone with JSON in the body should create a new document", () => {
		const response = request(app.server)
			.post("/api/questions/addone")
			.send({ "question": "test", "values": ["test"] })
			.expect("Content-Type", /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) throw err;
			});
	});
	test("POST /api/questions/addmany with an array of JSONs in the body should create multiple new document", () => {
		const response = request(app.server)
			.post("/api/questions/addone")
			.send({
				"array": [
					{ "question": "test", "values": ["test"] },
					{ "question": "test", "values": ["test"] }
				]
			})
			.expect("Content-Type", /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) throw err;
			});
	});
	test("POST /api/questions/:id/replace/ with an id in the params and a JSON in the body should keep the same id and replace the question/values", () => {});
	test("POST /api/questions/:id/values/replace with an id and value in the params and a JSON in the body should keep the same id and question, replacing only the values", () => {});
});

describe("Safe API Calls GET", () => {
	test("GET /api/questions/:id/ with an id number in the params should get that document", () => {});
	test("GET /api/questions/value/:value with a value in the params should get all questions with that value", () => {
		const response = request(app.server)
			.get("/api/questions/value/test")
			.expect("Content-Type", /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) throw err;
			});
	});
	test("GET /api/questions/random/:number with a number in the params should get that many random questions", () => {});
});

describe("Restricted API Calls DELETE", () => {
	test("DELETE /api/questions/:id/delete/ with an id in the params should delete that question", () => {});
});
