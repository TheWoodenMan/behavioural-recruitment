const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api");

router.post("/questions/addone", apiController.addOneQuestion);
router.post("/questions/addmany", apiController.addManyQuestions);
router.get("/questions/:id/", apiController.getQuestionById);

// receives the object in the body and replaces the id in the params with the new object.
router.post("/questions/:id/replace/", apiController.replaceByQuestionId);

// searches for a question by id then replaces the values with the body of the request
router.post(
	"/questions/:id/values/replace",
	apiController.replaceValuesByQuestionId
);

// adds one value as a string to the array of values, based on question ID number
router.patch(
	"/questions/:id/:value/addvalue/",
	apiController.addValueByQuestionId
);

// searches the db values arrays and displays each full record that matches
// the leadership value search string
router.get("/questions/value/:value", apiController.getQuestionsByValue);

// Gets a number of random documents from the db and returns them
router.get("/questions/random/:number", apiController.getRandomQuestions);

// Gets a question by id number, then deletes it
router.delete("/questions/:id/delete/", apiController.deleteQuestionById);

module.exports = router;
