import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Asynchronously reads and parses a JSON file.
 * @param filePath - Relative or absolute path to the JSON file.
 * @returns The parsed JSON object or array.
 * @throws If the file is invalid, unreadable, or contains empty/invalid content.
 */
export async function parseJson(filePath: string): Promise<object> {
  if (!filePath.endsWith('.json')) {
    throw new Error('File must have a .json extension');
  }

  const absolutePath = path.resolve(filePath);
  let content: string;

  try {
    content = await fs.readFile(absolutePath, 'utf-8');
  } catch (err) {
    throw new Error('File read error: ' + (err as Error).message);
  }

  if (!content.trim()) {
    throw new Error('JSON file is empty');
  }

  let parsed: object | Array<object> | undefined = undefined;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid JSON format');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Parsed JSON must be an object or an array');
  }

  const isEmptyArray = Array.isArray(parsed) && parsed.length === 0;
  const isEmptyObject = !Array.isArray(parsed) && Object.keys(parsed).length === 0;

  if (isEmptyArray || isEmptyObject) {
    throw new Error('JSON content is empty');
  }

  const objectsToCheck = Array.isArray(parsed) ? parsed : [parsed];
  for (let i = 0; i < objectsToCheck.length; i++) {
    const obj = objectsToCheck[i];
    for (const key in obj) {
      if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
        throw new Error(`Empty field detected in object at index ${i}, key "${key}"`);
      }
    }
  }

  return parsed;
}
