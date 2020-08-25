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

    // get documents where languages array contains 'Serbian'
    const serbianLanguage = await collection
      .find({
        languages: 'Serbian',
      })
      .count();

    console.log(`🇷🇸 ${serbianLanguage} movies, where Serbian is one of languages.\n\n`);

    // get documents where languages array contains only 'Serbian'
    const onlySerbianLanguage = await collection
      .find({
        languages: ['Serbian'],
      })
      .count();

    console.log(`🇷🇸 ${onlySerbianLanguage} movies, where Serbian is only language.\n\n`);

    // Serbian and English are in languages array
    const serbianAndEnglish = await collection
      .find({
        languages: {
          $all: ['Serbian', 'English'],
        },
      })
      .count();

    console.log(`🇷🇸 🇬🇧 ${serbianAndEnglish} movies, where Serbian and English are in language array.\n\n`);

    // Any of array elements is any of array element
    const actors = ['Bruce Willis', 'Jim Carrey', 'Quentin Tarantino'];
    const actorsResult = await collection
      .find({
        cast: {
          $in: actors,
        },
      })
      .count();

    console.log(`🎥 ${actorsResult} movies, where one of ${actors.join(', ')} is in cast.\n\n`);

    // get documents where array length is 3
    const threeLanguage = await collection
      .find({
        languages: {
          $size: 3,
        },
      })
      .count();

    console.log(`🌍 ${threeLanguage} movies, where 3 languages are spoken.\n\n`);

    // documents where any of array elements match criteria
    const randomNumResult = await collection
      .find({
        someRandomNumbers: {
          $elemMatch: { $gt: 30, $lte: 40 },
        },
      })
      .count();

    console.log(
      `🎬 ${randomNumResult} movies, where some element of 'someRandomNumbers' is bigger than 30, and less or equal to 50.\n\n`
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    console.log('👋 bye!');
    process.exit(0);
  }
})();
