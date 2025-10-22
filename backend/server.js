// REAL Movie routes - Fetches from TMDB API
app.get('/api/movies/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=1e407dce62f05c3441591706634f15e7&page=${page}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

// REAL TV Show routes
app.get('/api/tv/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=1e407dce62f05c3441591706634f15e7&page=${page}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    res.status(500).json({ message: 'Error fetching TV shows' });
  }
});

// REAL Genre-based movies
app.get('/api/movies/genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=1e407dce62f05c3441591706634f15e7&with_genres=${genreId}&page=${page}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching genre movies:', error);
    res.status(500).json({ message: 'Error fetching genre movies' });
  }
});