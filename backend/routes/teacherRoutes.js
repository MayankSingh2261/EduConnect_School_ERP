const express = require("express");

const {
  addTeacher,
  getTeachers,
} = require("../controllers/teacherController");

const router = express.Router();

router.post("/", addTeacher);

router.get("/", getTeachers);

module.exports = router;