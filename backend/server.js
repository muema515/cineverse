import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user database
const users = [
  {
    id: 1,
    email: 'demo@example.com',
    password: 'password123',
    username: 'MovieLover'
  }
];

// ========== ROUTES ==========

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎬 CineVerse Backend API is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      movies: {
        popular: '/api/movies/popular',
        search: '/api/movies/search?query=avatar',
        details: '/api/movies/:id'
      },
      tv: {
        popular: '/api/tv/popular',
        search: '/api/tv/search?query=breaking+bad',
        details: '/api/tv/:id'
      },
      auth: {
        login: '/api/auth/login (POST)',
        register: '/api/auth/register (POST)'
      }
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CineVerse Backend is running perfectly!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Authentication routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', email);
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token: 'mock-jwt-token-for-demo',
      message: 'Login successful! Welcome back!'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password. Try: demo@example.com / password123'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, username } = req.body;
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    email,
    password,
    username
  };
  users.push(newUser);
  
  res.json({
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    },
    token: 'mock-jwt-token-for-demo',
    message: 'Registration successful! Welcome to CineVerse!'
  });
});

// Movie routes
app.get('/api/movies/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=1e407dce62f05c3441591706634f15e7&page=${page}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

app.get('/api/movies/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=1e407dce62f05c3441591706634f15e7&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Error searching movies' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=1e407dce62f05c3441591706634f15e7`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ message: 'Error fetching movie details' });
  }
});

// TV Show routes
app.get('/api/tv/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=1e407dce62f05c3441591706634f15e7&page=${page}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    res.status(500).json({ message: 'Error fetching TV shows' });
  }
});

app.get('/api/tv/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=1e407dce62f05c3441591706634f15e7&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error searching TV shows:', error);
    res.status(500).json({ message: 'Error searching TV shows' });
  }
});

app.get('/api/tv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=1e407dce62f05c3441591706634f15e7`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    res.status(500).json({ message: 'Error fetching TV show details' });
  }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: {
      root: '/',
      health: '/api/health',
      movies: '/api/movies/popular',
      tv: '/api/tv/popular',
      auth: '/api/auth/login'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 CineVerse Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Root endpoint: http://localhost:${PORT}/`);
  console.log(`🎯 Demo login: demo@example.com / password123`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
});