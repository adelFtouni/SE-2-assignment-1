// __tests__/jsonParser.test.ts
import { parseJson } from '../src/parsers/jsonParser';
import * as fs from 'fs/promises';

jest.mock('fs/promises');
const mockReadFile = fs.readFile as jest.Mock;

describe('parseJson', () => {
  beforeAll(() => {
    console.log('Starting JSON parser test suite...');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.log('Test completed.');
  });

  afterAll(() => {
    console.log('All JSON parser tests done.');
  });

  // ✅ Individual test cases

  it('should throw an error if file does not end with .json', async () => {
    await expect(parseJson('data.txt')).rejects.toThrow('File must have a .json extension');
  });

  it('should throw an error if file is empty', async () => {
    mockReadFile.mockResolvedValue('');
    await expect(parseJson('data.json')).rejects.toThrow('JSON file is empty');
  });

  it('should throw an error if JSON is empty object', async () => {
    mockReadFile.mockResolvedValue('{}');
    await expect(parseJson('data.json')).rejects.toThrow('JSON content is empty');
  });

  it('should throw an error if JSON is empty array', async () => {
    mockReadFile.mockResolvedValue('[]');
    await expect(parseJson('data.json')).rejects.toThrow('JSON content is empty');
  });

  it('should throw an error if JSON is invalid', async () => {
    mockReadFile.mockResolvedValue('{ name: "noQuotes" }');
    await expect(parseJson('data.json')).rejects.toThrow('Invalid JSON format');
  });

  it('should throw an error if JSON is a primitive value', async () => {
    mockReadFile.mockResolvedValue('"just a string"');
    await expect(parseJson('data.json')).rejects.toThrow('Parsed JSON must be an object or an array');
  });

  it('should throw an error if any object has empty, null, or undefined field', async () => {
    const data = JSON.stringify([
      { name: 'Alice', age: 25 },
      { name: '', age: 30 },
    ]);
    mockReadFile.mockResolvedValue(data);
    await expect(parseJson('data.json')).rejects.toThrow('Empty field detected in object at index 1, key "name"');
  });

  it('should successfully parse valid JSON object', async () => {
    const data = JSON.stringify({ name: 'Test', age: 99 });
    mockReadFile.mockResolvedValue(data);
    const result = await parseJson('data.json');
    expect(result).toEqual({ name: 'Test', age: 99 });
  });

  it('should successfully parse valid JSON array', async () => {
    const data = JSON.stringify([{ id: 1 }, { id: 2 }]);
    mockReadFile.mockResolvedValue(data);
    const result = await parseJson('data.json');
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });
});
