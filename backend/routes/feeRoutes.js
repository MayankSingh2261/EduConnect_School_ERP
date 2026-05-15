const express = require("express");

const {
  addFee,
  getFees,
} = require("../controllers/feeController");

const router = express.Router();

router.post("/", addFee);

router.get("/", getFees);

module.exports = router;