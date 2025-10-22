import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test data
const testMovies = [
  {
    id: 1,
    title: "The Avengers",
    poster_path: "/cezWGskPY5x7GaglTTRN4Fugfb8.jpg",
    vote_average: 7.9,
    release_date: "2012-04-25"
  },
  {
    id: 2, 
    title: "Avatar",
    poster_path: "/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    vote_average: 7.6,
    release_date: "2009-12-18"
  }
];

// ========== ROUTES ==========

// Root route - FIXED
app.get('/', (req, res) => {
  res.json({
    message: '🎬 CineVerse Backend is WORKING!',
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is healthy!',
    timestamp: new Date().toISOString()
  });
});

// Movies
app.get('/api/movies/popular', (req, res) => {
  res.json({
    results: testMovies,
    total_results: testMovies.length
  });
});

// TV Shows
app.get('/api/tv/popular', (req, res) => {
  res.json({
    results: [
      {
        id: 1,
        name: "Stranger Things",
        poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
        vote_average: 8.6
      },
      {
        id: 2,
        name: "Breaking Bad", 
        poster_path: "/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg",
        vote_average: 8.9
      }
    ]
  });
});

// Login
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Root: http://localhost:${PORT}/`);
  console.log(`✅ Health: http://localhost:${PORT}/api/health`);
});