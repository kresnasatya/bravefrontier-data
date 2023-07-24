import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
import getOmniUnits from './index.js';
import { milisConverter } from '../helper.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFile = path.join(__dirname, '..', '..', 'data', 'omniunits', 'raw.json');

(async () => {
    const t0 = performance.now();

    console.log(`\n Scraping of Brave Frontier units started initiated...\n`);
    
    const omniUnits = await getOmniUnits();

    fs.writeFile(outputFile, JSON.stringify(omniUnits), err => {
        if (err) {
            console.log(err);
        }
        console.log(`\n Scraping omni units finish. Success export ${omniUnits.length} units to ${outputFile}. \n`);

        const t1 = performance.now();
        console.log(`\n Process took: ${milisConverter(t1 - t0)}. \n`);
    });
})();