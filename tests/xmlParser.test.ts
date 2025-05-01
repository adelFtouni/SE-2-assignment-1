import { parseXml } from '../src/parsers/xmlParser';
import * as fs from 'fs/promises';

jest.mock('fs/promises');
const mockReadFile = fs.readFile as jest.Mock;

describe('parseXml', () => {
  beforeAll(() => {
    console.log('Starting XML parser test suite...');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.log('Test completed.');
  });

  afterAll(() => {
    console.log('All XML parser tests done.');
  });

  it('should throw an error if file does not end with .xml', async () => {
    await expect(parseXml('data.txt')).rejects.toThrow('File must have a .xml extension');
  });

  it('should throw an error if file is empty', async () => {
    mockReadFile.mockResolvedValue('');
    await expect(parseXml('data.xml')).rejects.toThrow('XML file is empty');
  });

  it('should throw an error if XML is invalid', async () => {
    mockReadFile.mockResolvedValue('<note><to>John</from></note>'); // malformed
    await expect(parseXml('data.xml')).rejects.toThrow('Invalid XML format');
  });

 


  it('should throw an error if any field is empty', async () => {
    mockReadFile.mockResolvedValue(`
      <person>
        <name></name>
        <age>30</age>
      </person>
    `);
    await expect(parseXml('data.xml')).rejects.toThrow('Empty field detected at "person.name"');
  });

  it('should successfully parse valid XML object', async () => {
    mockReadFile.mockResolvedValue(`
      <person>
        <name>Alice</name>
        <age>25</age>
      </person>
    `);
    const result = await parseXml('data.xml');
    expect(result).toEqual({ person: { name: 'Alice', age: '25' } });
  });

  it('should successfully parse nested XML', async () => {
    mockReadFile.mockResolvedValue(`
      <company>
        <employee>
          <name>John</name>
          <department>IT</department>
        </employee>
      </company>
    `);
    const result = await parseXml('data.xml');
    expect(result).toEqual({
      company: {
        employee: {
          name: 'John',
          department: 'IT'
        }
      }
    });
  });
});
