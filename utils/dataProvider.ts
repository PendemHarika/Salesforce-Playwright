import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parse/sync';
import * as XLSX from 'xlsx';

/**
 * Utility class for reading test data from JSON, CSV, and XLSX files.
 */
export class DataProvider {
  /**
   * Read and parse a JSON file
   * @param filePath Path to the JSON file
   * @returns Parsed JSON data
   */
  static readTestDataFromJson(filePath: string): any {
    try {
      const absolutePath = path.resolve(filePath);
      const data = fs.readFileSync(absolutePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to read JSON file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Read and parse a CSV file
   * @param filePath Path to the CSV file
   * @returns Array of objects representing rows
   */
  static readTestDataFromCsv(filePath: string): any[] {
    try {
      const absolutePath = path.resolve(filePath);
      const data = fs.readFileSync(absolutePath, 'utf-8');
      return csv.parse(data, {
        columns: true,
        skip_empty_lines: true
      });
    } catch (error) {
      console.error(`Failed to read CSV file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Read and parse an XLSX file
   * @param filePath Path to the XLSX file
   * @param sheetName Optional sheet name (defaults to first sheet)
   * @returns Array of objects representing rows
   */
  static readTestDataFromXlsx(filePath: string, sheetName?: string): any[] {
    try {
      const absolutePath = path.resolve(filePath);
      const workbook = XLSX.readFile(absolutePath);
      const sheet = sheetName || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheet];
      return XLSX.utils.sheet_to_json(worksheet);
    } catch (error) {
      console.error(`Failed to read XLSX file: ${filePath}`, error);
      throw error;
    }
  }



static readTestData(filePath: string, sheetName: string, testCaseNo: string): Map<string, string> {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

    const testCaseRow = jsonData.find(row => row["TestCaseNo"] === testCaseNo);
    if (!testCaseRow) throw new Error(`Test case ${testCaseNo} not found in sheet ${sheetName}`);

    const dataMap = new Map<string, string>();
    for (const key in testCaseRow) {
      dataMap.set(key, testCaseRow[key]);
    }

    return dataMap;
  }

}
