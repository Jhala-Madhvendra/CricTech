const Joi = require("joi");

const allowedTeams = [
    "Chennai Super Kings",
    "Royal Challengers Bangalore",
    "Delhi Capitals",
    "Rajasthan Royals",
    "Mumbai Indians"
]

const allowedTossResults = [
    "Batting First",
    "Bowling First",
]

const schemaValidation = Joi.object({
    yourTeam: Joi.string().valid(...allowedTeams).required()
        .messages({
            "any.only": `"yourTeam" must be one of: ${allowedTeams.join(", ")}` 
        }),
    oppositionTeam: Joi.string().valid(...allowedTeams).disallow(Joi.ref("yourTeam")).required()
    .messages({
        "any.only": `valid team and not the same as "yourTeam".`
    }),
    overs: Joi.number().min(1).max(20).required()
        .messages({
            "number.base": `"overs" must be a number`,
            "number.min": `"overs" must be greater than or equal to 1`,
            "number.max": `"overs" must be less than or equal to 20`
        }),
    tossResult: Joi.string().valid(...allowedTossResults).required()
        .messages({
            "any.only": `"tossResult" must be one of: ${allowedTossResults.join(", ")}` 
        }),
    runsScored: Joi.number().min(0).required()
        .messages({
            "number.base": `"runsScored" must be a number`,
            "number.min": `"runsScored" must be greater than or equal to 0`
        }),        
});

const inputValidation = (req, res, next) => {
    const { error } = schemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = 
    {
    inputValidation
    };
