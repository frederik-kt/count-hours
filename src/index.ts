import fs from "fs";
import path from "path";
import promptSync from "prompt-sync";
import { padString, parseCSV, stringToDate } from "./util.js";
import { DateTime } from "luxon";

// ---- Reading and parsing CSV ----
const readAndParseCSV = (): string[][] => {
  const homeDir: string | undefined = process.env.HOME;
  if (!homeDir) {
    process.exit(1);
  }
  const filePath = path.join(homeDir, "Stunden.csv");
  const fileString = fs.readFileSync(filePath, "utf-8");
  return parseCSV(fileString);
};

// ---- Reading user date input ----

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.\d{4}$/;
const isValidDate = (date: string): boolean => dateRegex.test(date);

const prompt = promptSync();

const readDate = (): DateTime => {
  let dateString: string;
  do {
    dateString = prompt("");
    if (!isValidDate(dateString)) {
      console.log(
        "Invalid date format. Please try again using the format 'DD.MM.YYYY'"
      );
    }
  } while (!isValidDate(dateString));

  const date: DateTime | undefined = stringToDate(dateString, "dd.MM.yyyy");

  if (!date) {
    console.error(`Parsing the date ${dateString} failed. Check the format.`);
    process.exit(1);
  }

  return date;
};

// ---- Retrieving date index ----

const findDateIndex = (
  dateToFind: DateTime,
  dateStringArray: string[]
): number => {
  for (const [index, dateString] of dateStringArray.entries()) {
    const date = stringToDate(dateString, "dd.MM.yy");
    if (date && date.equals(dateToFind)) {
      return index;
    }
  }

  console.error(`Could not find the date ${dateToFind.toString()}`);
  process.exit(1);
};

// ---- Remove unnecessary dates ----

const removeUnnecessaryDates = (
  data: string[][],
  startDateIndex: number,
  endDateIndex: number
): string[][] => {
  const optimizedData: string[][] = [];

  for (const row of data) {
    optimizedData.push(row.slice(startDateIndex, endDateIndex + 1));
  }

  return optimizedData;
};

// ---- Execution ----

// Ask user about start and end date.
console.log("Please enter the start date (DD.MM.YYYY)");
const startDate: DateTime = DateTime.fromFormat("19.09.2023", "dd.MM.yyyy"); //readDate();
console.log("Please enter the end date (DD.MM.YYYY)");
const endDate: DateTime = DateTime.fromFormat("22.09.2023", "dd.MM.yyyy"); //readDate();

// If the end date is before the start date, throw an error.
if (endDate < startDate) {
  console.error("End date cannot be before the start date.");
  process.exit(1); // Exit the script with a non-zero exit code.
}

const data: string[][] = readAndParseCSV();

// Find the column indices that correspond to the start and end date.
const startDateIndex: number = findDateIndex(startDate, data[0]);
const endDateIndex: number = findDateIndex(endDate, data[0]);

// Optimization: Remove all entries that are outside of the start date and end date indices.
const optimizedData = removeUnnecessaryDates(
  data,
  startDateIndex,
  endDateIndex
);

// Create an array of maps, one map per day. Each map will contain the different entries as keys and the quarter hours clocked for those entries as values.
const maps: Array<Map<string, number>> = [];

// Iterate through the date indices denoted by the start date and end date.
const startIndex = 0;
const endIndex = endDateIndex - startDateIndex;
const uniqueKeys = new Set<string>();
for (let j = startIndex; j < endIndex + 1; j++) {
  const map = new Map<string, number>();
  // Iterate through the data leaving out the first row (contains the dates) and the last row (contains the sums).
  for (let i = 1; i < optimizedData.length - 1; i++) {
    const slot: string = optimizedData[i][j];
    if (slot.length > 0) {
      const key = slot.replace(" ", "_");
      uniqueKeys.add(key);
      if (map.has(key) && map.get(key) !== undefined) {
        map.set(key, map.get(key)! + 1);
      } else {
        map.set(key, 1);
      }
    }
  }
  maps.push(map);
}

// Print the result in a table.
console.log("Result:");

const headers = data[0].slice(startDateIndex, endDateIndex + 1);

// Calculate the maximum length for each column.
let maxKeyLength = Math.max(...Array.from(uniqueKeys).map((key) => key.length));
let maxHeaderLength = Math.max(...headers.map((header) => header.length));

const columnWidths = [Math.max(maxKeyLength, 0)];
for (const header of headers) {
  columnWidths.push(Math.max(maxHeaderLength, header.length));
}

// Header row.
const headerRow = [""]
  .concat(headers)
  .map((header, index) => padString(header, columnWidths[index]))
  .join(" | ");
console.log(headerRow);

// Data rows.
for (const key of uniqueKeys) {
  const row: string[] = [key];
  for (const map of maps) {
    row.push(map.get(key) ? (map.get(key)! / 4).toString() : "-");
  }
  const paddedRow = row
    .map((row, index) => padString(row, columnWidths[index]))
    .join(" | ");
  console.log(paddedRow);
}
