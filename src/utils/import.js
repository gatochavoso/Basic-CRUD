import fs from "node:fs/promises";
import { parse } from "csv-parse";

export function importTasks() {
  let records = [];

  const parser = parse({
    delimiter: ",",
    columns: true,
  });

  // le o csv e parsea
  fs.readFile("tasks.csv", "utf8").then((data) => {
    parser.write(data);
    parser.end();
  });

  // coleta cada linha como objeto
  parser.on("readable", function () {
    let record = [];
    while ((record = parser.read()) !== null) {
      records.push(record);
    }
  });

  // faz um post pra cada linha do csv
  parser.on("finish", function () {
    for (const record of records) {
      fetch("http://localhost:3333/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    }
  });

  parser.on("error", function (err) {
    console.error(err.message);
  });
}
