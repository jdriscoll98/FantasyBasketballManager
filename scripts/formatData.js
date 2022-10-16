// read in data.json
import data from "../data.json";

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
  ],
});

const records = data.map((player) => {
  const {
    Name,
    Team,
    Position,
    Games,
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
  } = player;
  return {
    Name,
    Team,
    Position,
    Games,
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
  };
});
csvWriter
  .writeRecords(records) // returns a promise
  .then(() => {
    console.log("...Done");
  });
