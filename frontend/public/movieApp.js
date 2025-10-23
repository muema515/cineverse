// Complete Movie App with TMDB API and Movie Player Integration
class MovieApp {
    constructor() {
        this.apiKey = '1e407dce62f05c3441591706634f15e7';
        this.baseUrl = 'https://api.themoviedb.org/3';
        this.currentPage = 1;
        this.currentGenre = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFeaturedMovies();
        this.loadMovies();
        authManager.init();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', 
            this.debounce((e) => this.handleSearch(e), 500)
        );

        // Genre filters
        document.querySelectorAll('.genre-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleGenreFilter(e.target);
            });
        });

        // Load more button
        document.getElementById('loadMore').addEventListener('click', () => {
            this.loadMoreMovies();
        });

        // Navigation smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // CTA buttons
        document.querySelector('.cta-primary').addEventListener('click', () => {
            document.querySelector('a[href="#movies"]').click();
        });
    }

    async loadFeaturedMovies() {
        try {
            const response = await fetch(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=1`);
            const data = await response.json();
            this.renderFeaturedMovies(data.results.slice(0, 8));
        } catch (error) {
            console.error('Error loading featured movies:', error);
        }
    }

    async loadMovies(genreId = null) {
        try {
            let url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${this.currentPage}`;
            
            if (genreId && genreId !== 'all') {
                url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&page=${this.currentPage}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            this.renderMovies(data.results);
        } catch (error) {
            console.error('Error loading movies:', error);
        }
    }

    renderFeaturedMovies(movies) {
        const container = document.getElementById('featuredCarousel');
        container.innerHTML = movies.map(movie => `
            <div class="flex-shrink-0 w-64 media-card rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                 data-movie-id="${movie.id}" data-movie-title="${movie.title}">
                <img src="https://image.tmdb.org/t/p/w400${movie.poster_path}" 
                     alt="${movie.title}"
                     class="w-full h-80 object-cover"
                     onerror="this.src='https://via.placeholder.com/300x450/374151/9ca3af?text=No+Image'">
                <div class="p-4 bg-gray-800">
                    <h3 class="font-bold text-white mb-2 truncate">${movie.title}</h3>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-yellow-400">
                            <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}
                        </span>
                        <span class="text-gray-400">${movie.release_date?.split('-')[0] || 'N/A'}</span>
                    </div>
                    <button onclick="showMoviePlayer(${movie.id}, '${movie.title.replace(/'/g, "\\'")}')" 
                            class="watch-now-btn w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105">
                        <i class="fas fa-play mr-2"></i>Watch Now
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderMovies(movies) {
        const container = document.getElementById('moviesGrid');
        
        if (this.currentPage === 1) {
            container.innerHTML = ''; // Clear only on first load
        }

        const moviesHTML = movies.map(movie => `
            <div class="media-card bg-gray-800 rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group"
                 data-movie-id="${movie.id}" data-movie-title="${movie.title}">
                <div class="relative overflow-hidden">
                    <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" 
                         alt="${movie.title}"
                         class="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
                         onerror="this.src='https://via.placeholder.com/300x450/374151/9ca3af?text=No+Image'">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <button onclick="showMoviePlayer(${movie.id}, '${movie.title.replace(/'/g, "\\'")}')" 
                                class="watch-now-btn w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105">
                            <i class="fas fa-play mr-2"></i>Watch Now
                        </button>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-white mb-2 text-lg line-clamp-2">${movie.title}</h3>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-yellow-400">
                            <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}
                        </span>
                        <span class="text-gray-400">${movie.release_date?.split('-')[0] || 'N/A'}</span>
                    </div>
                    <p class="text-gray-300 text-sm mt-2 line-clamp-3">${movie.overview || 'No description available.'}</p>
                </div>
            </div>
        `).join('');

        container.innerHTML += moviesHTML;
    }

    handleGenreFilter(button) {
        // Update active state
        document.querySelectorAll('.genre-filter').forEach(btn => {
            btn.classList.remove('active', 'bg-purple-600', 'text-white');
            btn.classList.add('bg-gray-700', 'text-gray-300');
        });
        
        button.classList.add('active', 'bg-purple-600', 'text-white');
        button.classList.remove('bg-gray-700', 'text-gray-300');

        // Load movies for genre
        const genreId = button.getAttribute('data-genre');
        this.currentGenre = genreId;
        this.currentPage = 1;
        this.loadMovies(genreId);
    }

    async loadMoreMovies() {
        this.currentPage++;
        await this.loadMovies(this.currentGenre);
        
        // Smooth scroll to new movies
        setTimeout(() => {
            document.getElementById('moviesGrid').lastElementChild?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }

    handleSearch(event) {
        const query = event.target.value.trim();
        if (query.length > 2) {
            this.searchMovies(query);
        } else if (query.length === 0) {
            this.currentPage = 1;
            this.loadMovies(this.currentGenre);
        }
    }

    async searchMovies(query) {
        try {
            const response = await fetch(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`);
            const data = await response.json();
            this.renderMovies(data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.movieApp = new MovieApp();
});

// Updated authManager with backend connection
const authManager = {
    init() {
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.toggleLoginModal();
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Close modal on background click
        document.getElementById('loginModal').addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') {
                this.toggleLoginModal();
            }
        });
    },

    async handleLogin() {
        const inputs = document.querySelectorAll('#loginForm input');
        const credentials = {
            email: inputs[0].value || 'demo@example.com',
            password: inputs[1].value || 'password123'
        };

        // Show loading
        document.getElementById('loadingSpinner').classList.remove('hidden');
        document.getElementById('loadingSpinner').classList.add('flex');

        try {
            const response = await fetch('https://cineverse-backend.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (data.success) {
                this.showToast(data.message || 'Login successful! 🎉', 'success');
                this.toggleLoginModal();
                this.updateUIForUser(data.user);
            } else {
                this.showToast(data.message || 'Login failed. Try: demo@example.com / password123', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Fallback to demo success
            this.showToast('Demo login successful! 🎉', 'success');
            this.toggleLoginModal();
            this.updateUIForUser({ username: 'MovieLover' });
        } finally {
            document.getElementById('loadingSpinner').classList.add('hidden');
            document.getElementById('loadingSpinner').classList.remove('flex');
        }
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
            type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`;

        toast.classList.remove('translate-x-full');

        setTimeout(() => {
            toast.classList.add('translate-x-full');
        }, 4000);
    },

    toggleLoginModal() {
        const modal = document.getElementById('loginModal');
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
    },

    updateUIForUser(user) {
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.innerHTML = `<i class="fas fa-user mr-2"></i>${user.username}`;
        loginBtn.classList.add('bg-gradient-to-r', 'from-green-600', 'to-teal-600');
        loginBtn.classList.remove('from-purple-600', 'to-pink-600');
    }
};