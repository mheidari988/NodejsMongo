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

        const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper });
        assert.deepEqual(filterData[0], getData[4]);
        console.log('get() : filterData => WORKS');

        const limitData = await circulationRepo.get({}, 3);
        assert.equal(limitData.length, 3);
        console.log('get() : limitData => WORKS');

    } catch (error) {
        console.error(error);
    } finally {
        await client.db(dbName).dropDatabase();
        client.close();
    }
}

main();