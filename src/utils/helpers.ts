import csv from "csv-parser";
import fs from "fs";

export const isDev = process.env.NODE_ENV === "development";
/**
 *
 * Helper function that takes in relative path returns csv data as an array
 * @param path
 * @returns
 */
export const readCSV = async (path: string) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => reject(err));
  });
};

/**
 *
 * Formats data to YYYY-MM-DD
 * @param date
 * @returns
 */
export const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    dateStyle: "short",
  });
