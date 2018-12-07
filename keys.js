console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bandsInTown = process.env.BANDS_KEY

exports.omdbKey = process.env.OMDB_KEY