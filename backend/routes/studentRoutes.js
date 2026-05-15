const express = require("express");

const {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getStudents);

router.post("/", protect, allowRoles("admin"), addStudent);

router.put("/:id", protect, allowRoles("admin"), updateStudent);

router.delete("/:id", protect, allowRoles("admin"), deleteStudent);

module.exports = router;