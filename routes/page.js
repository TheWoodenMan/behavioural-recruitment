const express = require("express");
const router = express.Router();
const pageController = require("../controllers/page");

// *************** Express listeners to render pages with EJS *******************

router.get("/", pageController.getIndex);
router.get("/random", pageController.getRandom);
router.get("/values", pageController.getValues);
router.get("/questionForm", pageController.getQuestionForm);

// randomly search up to 10 questions and display them.
router.get("/randomSearch", pageController.getRandomSearch);

// randomly search up to 10 questions by value and display them.
router.get("/valueSearch", pageController.getValueSearch);

// Express listener that turns a form request into a new question.
router.post("/submitQuestion", pageController.submitQuestion);
router.delete("/deleteQuestion", pageController.deleteQuestion);
router.post("/replaceQuestion", pageController.replaceQuestion);

module.exports = router;
