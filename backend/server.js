const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// REAL TMDB API FETCH
app.get('/api/movies/popular', async (req, res) => {
  try {
    console.log('FETCHING REAL MOVIES FROM TMDB...');
    const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=1e407dce62f05c3441591706634f15e7');
    const data = await response.json();
    console.log('SUCCESS: Got', data.results.length, 'real movies');
    res.json(data);
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

app.get('/api/tv/popular', async (req, res) => {
  try {
    console.log('FETCHING REAL TV SHOWS FROM TMDB...');
    const response = await fetch('https://api.themoviedb.org/3/tv/popular?api_key=1e407dce62f05c3441591706634f15e7');
    const data = await response.json();
    console.log('SUCCESS: Got', data.results.length, 'real TV shows');
    res.json(data);
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch TV shows' });
  }
});

app.listen(PORT, () => {
  console.log('🚀 SERVER RUNNING ON PORT', PORT);
});