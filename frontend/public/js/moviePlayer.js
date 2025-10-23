// Movie Player with Multiple Backup Trailer Sources
function showMoviePlayer(movieId, movieTitle, type = 'movie') {
    console.log('Opening trailer for:', movieTitle);
    
    // Multiple trailer sources for each movie
    const movieTrailers = {
        550: { // Fight Club
            youtube: 'qtIqKaDlqXo', // Different trailer
            vimeo: '217847238'
        },
        680: { // Pulp Fiction
            youtube: 's7EdQ4FqbhY',
            vimeo: '83559851'
        },
        155: { // The Dark Knight
            youtube: 'EXeTwQWrcwY', 
            vimeo: '119376532'
        },
        13: { // Forrest Gump
            youtube: 'bLvqoHBptjg',
            vimeo: '135114133'
        },
        238: { // The Godfather
            youtube: 'UaVTIH8mujA', // Different trailer
            vimeo: '82305551'
        }
    };
    
    // Get trailer data or use defaults
    const trailerData = movieTrailers[movieId] || {
        youtube: 'dQw4w9WgXcQ', // Fallback
        vimeo: '76979871'
    };
    
    // Try YouTube first, then Vimeo as backup
    let trailerUrl = `https://www.youtube.com/embed/${trailerData.youtube}?autoplay=1`;
    let sourceName = 'YouTube';
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.95)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '10000';
    overlay.style.padding = '20px';

    // Create player container
    const player = document.createElement('div');
    player.style.width = '100%';
    player.style.maxWidth = '800px';
    player.style.background = '#1a1a1a';
    player.style.borderRadius = '12px';
    overlay.style.overflow = 'hidden';
    player.style.position = 'relative';

    // Create header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.padding = '15px 20px';
    header.style.background = 'linear-gradient(45deg, #7c3aed, #ec4899)';
    header.style.color = 'white';
    
    const title = document.createElement('h3');
    title.textContent = '🎬 ' + movieTitle + ' - Trailer (' + sourceName + ')';
    title.style.margin = '0';
    title.style.fontSize = '1.2rem';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.background = 'rgba(255,255,255,0.2)';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.width = '35px';
    closeBtn.style.height = '35px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '1rem';
    closeBtn.onclick = function() {
        document.body.removeChild(overlay);
    };

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.style.position = 'relative';
    iframeContainer.style.paddingBottom = '56.25%';
    iframeContainer.style.height = '0';
    iframeContainer.style.overflow = 'hidden';

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = trailerUrl;
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allowFullscreen = true;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.title = movieTitle + ' Trailer';

    // If YouTube fails, try Vimeo
    iframe.onerror = function() {
        console.log('YouTube failed, trying Vimeo...');
        iframe.src = `https://player.vimeo.com/video/${trailerData.vimeo}?autoplay=1`;
        title.textContent = '🎬 ' + movieTitle + ' - Trailer (Vimeo)';
    };

    iframeContainer.appendChild(iframe);
    player.appendChild(header);
    player.appendChild(iframeContainer);
    overlay.appendChild(player);
    document.body.appendChild(overlay);

    // Close on background click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    // Close on ESC key
    const closeHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', closeHandler);
        }
    };
    document.addEventListener('keydown', closeHandler);
}

// Test with different movies
function testMoviePlayer(movieId = 550) {
    const testMovies = {
        550: "Fight Club",
        680: "Pulp Fiction", 
        155: "The Dark Knight",
        13: "Forrest Gump",
        238: "The Godfather"
    };
    
    const title = testMovies[movieId] || "Test Movie";
    showMoviePlayer(movieId, title);
}

// Add watch buttons
function addWatchButtons() {
    const movieCards = document.querySelectorAll('.media-card, [class*="card"]');
    
    movieCards.forEach(card => {
        if (card.querySelector('.watch-btn')) return;
        
        const movieId = card.getAttribute('data-movie-id') || '550';
        const movieTitle = card.getAttribute('data-movie-title') || 'Movie';
        
        const watchBtn = document.createElement('button');
        watchBtn.className = 'watch-btn';
        watchBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Watch Trailer';
        watchBtn.style.cssText = `
            background: linear-gradient(45deg, #7c3aed, #ec4899);
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 10px;
            width: 100%;
            transition: all 0.3s ease;
            font-size: 0.875rem;
        `;
        
        watchBtn.onclick = function(e) {
            e.stopPropagation();
            showMoviePlayer(movieId, movieTitle);
        };
        
        card.appendChild(watchBtn);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Movie player with backup sources loaded!');
    setTimeout(addWatchButtons, 1000);
});