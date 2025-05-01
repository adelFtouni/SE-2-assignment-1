
// import { parseJson } from './parsers/jsonParser';
import { parseXml } from './parsers/xmlParser';
import prettyjson from 'prettyjson';
// async function main(){
//     logger.info('Starting the application...')
//     const data = await readCsvFile('data/cake orders.csv', false)
//     logger.info('CSV file read successfully.')
//     console.log(data)
// }
//main();

// async function parseJsonFile() {
//     try {
//         const data = await parseJson('data/book orders.json');
//         console.log(data);
//     } catch (error) {
//         console.error('Error parsing JSON file:', error);
//     }
// }
// parseJsonFile();
async function parseXmlFile() {
    try {
        const data = await parseXml('data/toy orders.xml');
        console.log(prettyjson.render(data, { noColor: true }));
    } catch (error) {
        console.error('Error parsing XML file:', error);
    }
}
parseXmlFile();