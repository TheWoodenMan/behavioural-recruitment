const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api");

const db = require("../config/database");
const api = require("../controllers/api");
const Question = db.Question;

// API listener - Add one question populated from the body of a POST request in JSON format
router.post("/questions/addone", apiController.addOneQuestion);

// API Listener - add many questions as an array of objects
router.post("/questions/addmany", apiController.addManyQuestions);

// API listener - searches the db by id number and displays the matching document.
router.get("/questions/:id/", apiController.getQuestionById);

// receives the object in the body and replaces the id in the params
// with the new object.
router.post("/questions/:id/replace/", apiController.replaceQuestionById);

// searches for a question by id then replaces the values with the body of the request
router.post(
	"/questions/:id/values/replace",
	apiController.replaceValuesByQuestionId
);

// searches the db values arrays and displays each full record that matches
// the leadership value search string
router.get("/questions/values/:value", apiController.getQuestionsByValue);

// Gets a number of random documents from the db and returns them
router.get("/questions/random/:number", apiController.getRandomQuestions);

module.exports = router;
