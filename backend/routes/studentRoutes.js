const express = require("express");

const {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  resetGuardianPassword,
} = require("../controllers/studentController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getStudents);

router.post("/", protect, allowRoles("admin"), addStudent);

router.put("/:id", protect, allowRoles("admin"), updateStudent);

router.delete("/:id", protect, allowRoles("admin"), deleteStudent);

router.put( "/:studentId/reset-guardian-password", resetGuardianPassword);

module.exports = router;