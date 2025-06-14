import { prisma } from "@/lib/prisma";

export default async function GroupTable({
  groupId,
  tournamentId,
}: Readonly<{ tournamentId: string; groupId: string }>) {
  const [teams, matches] = await Promise.all([
    prisma.groupTeam.findMany({
      where: {
        groupId,
      },
      include: {
        team: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.match.findMany({
      where: {
        tournamentId,
        groupId,
        type: "GROUP",
        status: "COMPLETED",
      },
    }),
  ]);

  const standings = teams.map((team) => {
    const teamMatches = matches.filter(
      (match) =>
        match.homeTeamId === team.teamId || match.awayTeamId === team.teamId
    );

    let points = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    teamMatches.forEach((match) => {
      if (match.homeTeamId === team.teamId) {
        goalsFor += match.homeTeamScore;
        goalsAgainst += match.awayTeamScore;
        if (match.homeTeamScore > match.awayTeamScore) points += 3;
        else if (match.homeTeamScore === match.awayTeamScore) points += 1;
      } else {
        goalsFor += match.awayTeamScore;
        goalsAgainst += match.homeTeamScore;
        if (match.awayTeamScore > match.homeTeamScore) points += 3;
        else if (match.awayTeamScore === match.homeTeamScore) points += 1;
      }
    });

    return {
      team: team.team.name,
      points,
      played: teamMatches.length,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
    };
  });

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr key={standing.team}>
              <td>{standing.team}</td>
              <td>{standing.played}</td>
              <td>
                {Math.floor(
                  (standing.points -
                    (standing.played - Math.floor(standing.points / 3))) /
                  3
                )}
              </td>
              <td>
                {standing.played -
                  Math.floor(standing.points / 3) -
                  Math.floor(
                    (standing.points -
                      (standing.played - Math.floor(standing.points / 3))) /
                    3
                  )}
              </td>
              <td>{Math.floor(standing.points / 3)}</td>
              <td>{standing.goalsFor}</td>
              <td>{standing.goalsAgainst}</td>
              <td>{standing.goalDifference}</td>
              <td>{standing.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
