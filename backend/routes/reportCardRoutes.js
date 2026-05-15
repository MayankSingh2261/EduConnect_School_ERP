const express = require("express");

const {
  generateSingleReportCard,
  generateAllReportCards,
  getReportCards,
} = require("../controllers/reportCardController");

const router = express.Router();

// GET ALL REPORT CARDS
router.get("/", getReportCards);

// GENERATE SINGLE REPORT CARD
router.post(
  "/generate/:studentId",
  generateSingleReportCard
);

// GENERATE ALL REPORT CARDS
router.post(
  "/generate-all",
  generateAllReportCards
);

module.exports = router;