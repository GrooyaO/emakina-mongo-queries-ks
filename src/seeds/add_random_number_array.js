function randomInteger(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

const { MongoClient } = require('mongodb');

const DB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'emakinaks';
const DB_COLLECTION = 'movies';

const config = {
  useUnifiedTopology: true,
};

(async () => {
  try {
    const client = await MongoClient.connect(DB_URL, config);
    console.log('🔛 Connected to DB\n------------------\n\n');

    const collection = client.db(DB_NAME).collection(DB_COLLECTION);

    const cursor = collection.find({});

    while (await cursor.hasNext()) {
      let document = await cursor.next();

      await collection.updateOne(
        { _id: document._id },
        {
          $addToSet: {
            someRandomNumbers: {
              $each: [
                randomInteger(1, 100),
                randomInteger(50, 100),
              ],
            },
          },
        },
        {
          upsert: true,
        });
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    console.log('👋 bye!');
    process.exit(0);
  }
})();
