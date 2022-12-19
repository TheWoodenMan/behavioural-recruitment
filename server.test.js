const request = require("supertest");
const app = require("./server");
const db = require("./config/database");
const mongoose = require("mongoose");

describe("Load Pages", () => {
	afterAll(() => {
		mongoose.disconnect();
		clearInterval(app.setIntervalKey);

		//setTimeout(() => app.shutDown(), 3000);
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
	// test("GET /questionList should return questionList.ejs", (done) => {
	// 	const res = request(app.server)
	// 		.get("/questionList")
	// 		.expect("Content-Type", /text\/html/)
	// 		.expect(200)
	// 		.end(done);
	// }, 20000);
	test("GET /values should return values.ejs", (done) => {
		const res = request(app.server)
			.get("/values")
			.expect("Content-Type", /text\/html/)
			.expect(200)
			.end(done);
	}, 10000);
	// test("GET /questionForm should return questionForm.ejs", (done) => {
	// 	const res = request(app.server)
	// 		.get("/questionForm")
	// 		.expect("Content-Type", /text\/html/)
	// 		.expect(200)
	// 		.end(done);
	// }, 10000);
});

describe("GET Page Functions", () => {
	it("GET /randomSearch should return up to 10 random records", () => {});
	it("GET /valueSearch should return all records by a given value from form input and button push", () => {});
	// it("GET /questionList should return questionList.ejs", () => {});
	it("GET /values should return values.ejs", () => {});
	// it("GET /questionForm should return questionForm.ejs", () => {});
});

describe("POST Page Functions", () => {
	it("POST /submitQuestion with a question in the body should create a new Question documents", () => {});
});

describe("DELETE Page Functions", () => {
	it("DELETE /deleteQuestion should delete a question by id after button push", () => {});
});

describe("Safe API Calls GET", () => {
	it("GET /questions/:id/ with an id number in the params should get that document", () => {});
	it("GET /questions/value/:value with a value in the params should get all questions with that value", () => {});
	it("GET /questions/random/:number with a number in the params should get that many random questions", () => {});
});

describe("Restricted API Calls POST", () => {
	it("POST /questions/addone with JSON in the body should create a new document", () => {});
	it("POST /questions/addmany with an array of JSONs in the body should create multiple new document", () => {});
	it("POST /questions/:id/replace/ with an id in the params and a JSON in the body should keep the same id and replace the question/values", () => {});
	it("POST /questions/:id/values/replace with an id and value in the params and a JSON in the body should keep the same id and question, replacing only the values", () => {});
});

describe("Restricted API Calls DELETE", () => {
	it("DELETE /questions/:id/delete/ with an id in the params should delete that question", () => {});
});
