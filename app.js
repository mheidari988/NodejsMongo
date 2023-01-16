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
        // loadData
        const results = await circulationRepo.loadData(data);
        assert.equal(data.length, results.insertedCount);
        console.log('loadData(data) => WORKS');

        // get
        const getData = await circulationRepo.get();
        assert.equal(data.length, getData.length);
        console.log('get() => WORKS');

        // get(filter)
        const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper });
        assert.deepEqual(filterData[0], getData[4]);
        console.log('get() : filterData => WORKS');

        // get(limit)
        const limitData = await circulationRepo.get({}, 3);
        assert.equal(limitData.length, 3);
        console.log('get() : limitData => WORKS');

        // getById
        const id = getData[4]._id.toString();
        const byId = await circulationRepo.getById(id);
        assert.deepEqual(byId, getData[4]);
        console.log('getById() : getData[4]._id => WORKS');

        // add
        const newItem = {
            "Newspaper": "My paper",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 2,
            "Change in Daily Circulation, 2004-2013": 100,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 0
        };
        const addedItem = await circulationRepo.add(newItem);
        const addedItemInDb = await circulationRepo.getById(addedItem._id);
        assert.deepEqual(addedItem, addedItemInDb);
        console.log('add(newItem) => WORKS');

        // update
        const updatedItem = await circulationRepo.update(addedItem._id, {
            "Newspaper": "My new paper",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 2,
            "Change in Daily Circulation, 2004-2013": 100,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 0
        });
        const updatedItemInDb = await circulationRepo.getById(addedItem._id);
        assert.equal(updatedItemInDb.Newspaper, "My new paper");
        console.log('update(id,{}) => WORKS');

        const removed = await circulationRepo.remove(updatedItemInDb._id);
        assert(removed);
        const removedItemFromDb = await circulationRepo.getById(addedItem._id);
        assert.equal(removedItemFromDb, null);
        console.log('remove(id) => WORKS');

        // aggregate
        const result = await circulationRepo.averageFinalists();
        console.log(result);
        
    } catch (error) {
        console.error(error);
    } finally {
        await client.db(dbName).dropDatabase();
        client.close();
    }
}

main();