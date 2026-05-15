const express = require("express");

const {
  addMark,
  getMarks,
  getStudentMarks,
} = require("../controllers/markController");

const router = express.Router();

router.post("/", addMark);

router.get("/", getMarks);

router.get("/student/:studentId", getStudentMarks);

module.exports = router;