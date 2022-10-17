// read in data.json
import data from "../data.json";
import players from "../players.json";
const playerData = Array.from(Object.values(players));
// write data to csv
import csv from "csv-writer";
const createCsvWriter = csv.createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "public/data.csv",
  header: [
    { id: "Name", title: "Name" },
    { id: "Team", title: "Team" },
    { id: "Position", title: "Position" },
    { id: "Games", title: "Games" },
    { id: "ThreePointersMade", title: "TPM" },
    { id: "FieldGoalsMade", title: "FGM" },
    { id: "FieldGoalsAttempted", title: "FGA" },
    { id: "FreeThrowsMade", title: "FTM" },
    { id: "FreeThrowsAttempted", title: "FTA" },
    { id: "Rebounds", title: "Rebounds" },
    { id: "Assists", title: "Assists" },
    { id: "Steals", title: "Steals" },
    { id: "BlockedShots", title: "Blocks" },
    { id: "Turnovers", title: "TO" },
    { id: "Points", title: "Points" },
    { id: "DoubleDoubles", title: "DD" },
    { id: "TripleDoubles", title: "TD" },
  ],
});

const records = data.map((player) => {
  const {
    Name,
    Team,
    Games,
    ThreePointersMade,
    FieldGoalsMade,
    FieldGoalsAttempted,
    FreeThrowsMade,
    FreeThrowsAttempted,
    Rebounds,
    Assists,
    Steals,
    BlockedShots,
    Turnovers,
    Points,
    DoubleDoubles,
    TripleDoubles,
  } = player;
  // find fantasy positions from players.json
  const matchedPlayer = playerData.find((p) => Name.includes(p.full_name));
  const fantasy_positions = matchedPlayer?.fantasy_positions || [];
  return {
    Name,
    Team,
    Position: fantasy_positions.join(" "),
    Games,
    ThreePointersMade,
    FieldGoalsMade,
    FieldGoalsAttempted,
    FreeThrowsMade,
    FreeThrowsAttempted,
    Rebounds,
    Assists,
    Steals,
    BlockedShots,
    Turnovers,
    Points,
    DoubleDoubles,
    TripleDoubles,
  };
});
csvWriter
  .writeRecords(records) // returns a promise
  .then(() => {
    console.log("...Done");
  });
