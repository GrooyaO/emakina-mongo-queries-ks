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

    // runtime attribute less or equal to 30
    const runtime30orLess = await collection
      .find({
        runtime: { $lte: 30 },
      })
      .count();
    console.log(`🎥 ${runtime30orLess} movies, 30 minutes or shorter.\n\n`);

    // runtime attribute greater than 90
    const runtimeGreaterThan90 = await collection
      .find({
        runtime: { $gt: 90 },
      })
      .count();
    console.log(`🎬 ${runtimeGreaterThan90} movies, longer than 90 minutes.\n\n`);

    // movies released on round years
    const years = [1950, 1960, 1970, 1980, 1990, 2000];
    const roundYears = await collection
      .find({
        year: { $in: years },
      })
      .count();
    console.log(`📽 ${roundYears} movies, released in round years. [${years.join(', ')}]\n\n`);

    // regular expressions
    const startsWithThe = await collection.find({
      title: {
        $regex: /^The /,
        // $regex: /^(A|An) /,
        // $regex: /\b(wo)?m[ae]n\b/i,
      },
    }).count();

    console.log(`🎥 ${startsWithThe} movies, which title starts with 'The'\n\n`);

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    console.log('👋 bye!');
    process.exit(0);
  }
})();
