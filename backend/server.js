import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const TMDB_API_KEY = '1e407dce62f05c3441591706634f15e7';

// ========== ROUTES ==========

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎬 CineVerse Backend with REAL TMDB Data!',
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend with REAL TMDB API is healthy!',
    timestamp: new Date().toISOString()
  });
});

// REAL Movies from TMDB API
app.get('/api/movies/popular', async (req, res) => {
  try {
    console.log('📡 Fetching REAL movies from TMDB...');
    const { page = 1 } = req.query;
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    const data = await response.json();
    console.log(`✅ Fetched ${data.results?.length || 0} real movies`);
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching real movies:', error);
    res.status(500).json({ 
      message: 'Error fetching real movies from TMDB',
      error: error.message 
    });
  }
});

// REAL TV Shows from TMDB API
app.get('/api/tv/popular', async (req, res) => {
  try {
    console.log('📡 Fetching REAL TV shows from TMDB...');
    const { page = 1 } = req.query;
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    const data = await response.json();
    console.log(`✅ Fetched ${data.results?.length || 0} real TV shows`);
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching real TV shows:', error);
    res.status(500).json({ 
      message: 'Error fetching real TV shows from TMDB',
      error: error.message 
    });
  }
});

// Login (static for demo)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'demo@example.com' && password === 'password123') {
    res.json({
      success: true,
      user: { username: 'MovieLover', email: 'demo@example.com' },
      message: 'Login successful!'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

console.log('🚀 Starting CineVerse Backend with REAL TMDB Data...');
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Using REAL TMDB API data`);
  console.log(`✅ Root: http://localhost:${PORT}/`);
});