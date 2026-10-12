import { writeFileSync } from 'node:fs';
import { demoRecords, topics, fields, anchor } from '../data.js';
const dictionary = fields.map(key => [...new Set(demoRecords.map(r => r[key]))]);
const rows = demoRecords.map(r => fields.map((key,i) => dictionary[i].indexOf(r[key])));
const payload = {anchor,topics,fields,dictionary,rows};
writeFileSync(new URL('../compatibility/data.js',import.meta.url),'/* Fictional sample records; generated from main data.js, no browser data. */\nvar SteepCompatData = '+JSON.stringify(payload)+';\n');
console.log('Generated compatibility/data.js from '+demoRecords.length+' fictional records.');
