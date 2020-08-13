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

    const result = await collection
      .find({
        $text: {
          // $search: 'christmas die hard',
          $search: 'christmas "die hard"',
          // $search: 'father',
          $caseSensitive: false,
        },

        'imdb.votes': { $gte: 1000 },
      })
      .sort({ 'imdb.rating': -1 })
      .limit(10)
      .map(movie => {
        return {
          title: movie.title,
          year: movie.year,
          rating: movie.imdb.rating,
          fullplot: movie.fullplot,
        };
      })
      .toArray();

    console.log(result);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    console.log('👋 bye!');
    process.exit(0);
  }
})();
