

const { pointsTable } = require('../constants/pointsTable');


function calculateRequiredNRR({
    userTeam,
    oppositionTeam,
    overs,
    desiredPosition,
    tossResult,
    runs
}) {
    let teams = Object.entries(pointsTable).map(([team, data]) => ({ team, ...data }));
    teams.sort((a, b) => b.pts - a.pts || b.nrr - a.nrr);

    let currentTeamIndex = teams.findIndex(team => team.team === userTeam);
    if (currentTeamIndex === -1) {
        throw new Error(`Team ${userTeam} not found in the points table.`);
    }

    let currentRank = currentTeamIndex + 1;
    if (desiredPosition === currentRank) {
        return {
            message: `${userTeam} is already at position ${desiredPosition}. No change needed.`,
            currentNRR: teams[currentTeamIndex].nrr
        };
    }

    if (desiredPosition > currentRank) {
        throw new Error(
            `Invalid request: ${userTeam} is currently ranked ${currentRank}, but desired position is ${desiredPosition}.`
        );
    }

    let targetTeam = teams[desiredPosition - 1];
    let maxPossiblePoints = teams[currentTeamIndex].pts + 2;
    if (maxPossiblePoints < targetTeam.pts) {
        throw new Error(`${userTeam} cannot reach position ${desiredPosition} as the point gap is greater than 2.`);
    }

    let currentNRR = teams[currentTeamIndex].nrr;
    let targetNRR = targetTeam.nrr;

    let requiredNRR = targetNRR + 0.001;
    let requiredRunRate = requiredNRR + (teams[currentTeamIndex].runsConceded / teams[currentTeamIndex].oversBowled);

    let response = {
        message: `${userTeam} has a chance to reach position ${desiredPosition}.`,
        currentNRR,
        targetNRR,
        requiredNRR
    };

    if (tossResult === "bat") {
        // Batting first: Calculating maximum runs we should restrict the opponent to
        let runsToRestrict = Math.ceil((runs / overs) - requiredNRR) * overs;
        response.restrictOpponentTo = Math.max(0, runsToRestrict);
    } else {
        // Chasing: Calculating overs to chase the target
        let requiredOversToChase = runs / requiredRunRate;
        response.chaseInOvers = Math.min(overs, requiredOversToChase.toFixed(2));
    }

    return response;
}



module.exports = { calculateRequiredNRR };