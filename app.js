const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {
    const client = new MongoClient(url);
    await client.connect();
    const admin = client.db(dbName).admin();

    try {
        const results = await circulationRepo.loadData(data);
        assert.equal(data.length, results.insertedCount);
        console.log('loadData(data) => WORKS');

        const getData = await circulationRepo.get();
        assert.equal(data.length, getData.length);
        console.log('get() => WORKS');

    } catch (error) {
        console.error(error);
    } finally {
        await client.db(dbName).dropDatabase();
        client.close();
    }
}

main();