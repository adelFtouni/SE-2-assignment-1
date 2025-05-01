import * as fs from 'fs/promises';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';

/**
 * Asynchronously reads and parses an XML file.
 * @param filePath - Relative or absolute path to the XML file.
 * @returns The parsed XML as a JavaScript object.
 * @throws If the file is invalid, unreadable, or contains empty/invalid content.
 */
export async function parseXml(filePath: string): Promise<object> {
  if (!filePath.endsWith('.xml')) {
    throw new Error('File must have a .xml extension');
  }

  const absolutePath = path.resolve(filePath);
  let content: string;

  try {
    content = await fs.readFile(absolutePath, 'utf-8');
  } catch (err) {
    throw new Error('File read error: ' + (err as Error).message);
  }

  if (!content.trim()) {
    throw new Error('XML file is empty');
  }

  let parsed: object | Array<object> | undefined = undefined;
  try {
    parsed = await parseStringPromise(content, { explicitArray: false });
  } catch {
    throw new Error('Invalid XML format');
  }

  if (!parsed || typeof parsed !== 'object' || Object.keys(parsed).length === 0) {
    throw new Error('Parsed XML must be a non-empty object');
  }

  const checkObject = (obj: unknown, parentPath = ''): void => {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const pathKey = `${parentPath}[${index}]`;
        checkObject(item, pathKey);
      });
    } else if (isObject(obj)) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          const pathKey = parentPath ? `${parentPath}.${key}` : key;
          if (value === '' || value === null || value === undefined) {
            throw new Error(`Empty field detected at "${pathKey}"`);
          } else if (typeof value === 'object') {
            checkObject(value, pathKey);
          }
        }
      }
    }
  };
  
  // Helper to ensure safe object type access
  function isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
  }

  checkObject(parsed);
  
  return parsed;
}
