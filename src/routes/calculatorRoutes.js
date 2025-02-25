const express = require("express");
const router = express.Router();
const NRRController = require("../controller/calculatorController");
const nrrService = require('../services/calculatorService');
const nrrValidator = require('../validators/inputValidation')

router.post("/predict-nrr", nrrValidator.inputValidation, NRRController.calculateNRRForMatch);

module.exports = router;
