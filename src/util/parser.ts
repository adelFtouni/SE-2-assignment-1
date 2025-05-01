import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

/**
 * Reads a CSV file and returns its content as a 2D array of strings.
 * @param filePath - The path to the CSV file to read.
 * @returns A promise that resolves to a 2D array of strings.
 */
export async function readCsvFile(filePath: string,includeHeader : boolean = false): Promise<string[][]> {
    const absolutePath = path.resolve(filePath);
    const fileStream = fs.createReadStream(absolutePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const rows: string[][] = [];
    for await (const line of rl) {
        rows.push(line.split(','));
    }
if(!includeHeader){
    rows.shift(); // Remove the header row if it exists
}
    return rows;
}

/**
 * Writes a 2D array of strings to a CSV file.
 * @param filePath - The path to the CSV file to write.
 * @param data - The 2D array of strings to write to the file.
 * @returns A promise that resolves when the file has been written.
 */
export async function writeCsvFile(filePath: string, data: string[][]): Promise<void> {
    const absolutePath = path.resolve(filePath);
    const csvContent = data.map(row => row.join(',')).join('\n');

    return new Promise((resolve, reject) => {
        fs.writeFile(absolutePath, csvContent, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}