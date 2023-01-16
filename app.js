const MongoClient = require('mongodb').MongoClient;

const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {
    const client = new MongoClient(url);
    await client.connect();

    const admin = client.db(dbName).admin();

    const results = await circulationRepo.loadData(data);

    console.log(results.insertedCount);
}

main();