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

    // explicit AND
    const highRatingAndVotes1 = await collection
      .find({
        $and: [
          { 'imdb.votes': { $gte: 10000 } },
          { 'imdb.rating': { $gt: 8.5 } },
        ],
      })
      .count();
    console.log(`📈 ${highRatingAndVotes1} movies with rating over 8.5 AND at least 10000 votes.\n\n`);

    // implicit AND
    const highRatingAndVotes2 = await collection
      .find({
        'imdb.votes': { $gte: 20000 },
        'imdb.rating': { $gt: 8.5 },
      })
      .count();
    console.log(`📈 ${highRatingAndVotes2} movies with rating over 8.5 AND at least 20000 votes.\n\n`);

    // OR
    const highRatingOrAwards = await collection
      .find({
        $or: [
          { 'imdb.rating': { $gt: 9 } },
          { 'awards.wins': { $gte: 10 } },
        ],
      })
      .count();
    console.log(`🏆 ${highRatingOrAwards} movies with rating over 9 OR at least 10 awards\n`);

    const highRatingAndVotesOrAwards = await collection
      .find({
        $or: [
          { $and: [
            { 'imdb.rating': { $gt: 9 } },
            { 'imdb.votes': { $gte: 10000 } },
          ],
        },
          { 'awards.wins': { $gte: 20 } },
        ],
      })
      .count();
    console.log(`🏆 ${highRatingAndVotesOrAwards} movies with high rating and votes OR at least 20 awards\n\n`);

    // NOT
    const nonUSAMovies = await collection
      .find({
        countries: {
          $not: { $eq: 'USA' },
        },
      })
      .count();

    console.log(`🌍 ${nonUSAMovies} movies outside of USA.\n\n`);

    // NOR
    const nonUSAAndCanada = await collection
      .find({
        $nor: [
          { countries: 'USA' },
          { countries: 'Canada' },
        ],
      })
      .count();

    console.log(`🚫 🇺🇸 🇨🇦 ${nonUSAAndCanada} movies outside USA and Canada.\n\n`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    console.log('👋 bye!');
    process.exit(0);
  }
})();
