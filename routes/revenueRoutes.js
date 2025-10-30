// routes/revenueRoutes.js
const express = require("express");
const router = express.Router();
const revenueController = require("../controllers/revenueController");

router.get("/revenue", revenueController.getRevenue);

module.exports = router;
