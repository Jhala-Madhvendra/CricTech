// nrrController.js

const nrrService = require('../services/calculatorService');

// Controller function to handle the API request
async function calculateNRRForMatch(req, res) {
  try {
    const { userTeam,
            oppositionTeam, 
            overs,
            desiredPosition,
            tossResult,
            runs 
        } = req.body;
        console.log("Request Body", req.body);
    // Call the service to calculate required runs or overs and NRR
    const result = await nrrService.calculateRequiredNRR({
      userTeam,
      oppositionTeam,
      overs,
      desiredPosition,
      tossResult,
      runs
  });

    return res.status(200).json({
      message: 'NRR calculation successful',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = { calculateNRRForMatch };
