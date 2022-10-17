import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const apiLink = `https://api.sportsdata.io/v3/nba/projections/json/PlayerSeasonProjectionStats/2023?key=${process.env.API_KEY}`;

export default async function fetchData() {
  const response = await fetch(apiLink);
  const data = await response.json();
  // write data to data.json
  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
    }
  });
}

fetchData();
