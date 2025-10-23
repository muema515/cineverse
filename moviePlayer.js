// Movie Player with YouTube Trailers
function showMoviePlayer(movieId, movieTitle, type = 'movie') {
    console.log('Opening YouTube trailer for:', movieTitle);
    
    // YouTube trailer IDs
    const youtubeTrailers = {
        550: 'qtIqKaDlqXo', // Fight Club
        680: 's7EdQ4FqbhY', // Pulp Fiction
        155: 'EXeTwQWrcwY', // The Dark Knight
        13: 'bLvqoHBptjg',  // Forrest Gump
        238: 'sY1S34973zA'  // The Godfather
    };
    
    const trailerId = youtubeTrailers[movieId] || 'dQw4w9WgXcQ';
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.95); display: flex; justify-content: center; 
        align-items: center; z-index: 10000; padding: 20px;
    `;

    const player = document.createElement('div');
    player.style.cssText = `
        width: 100%; max-width: 800px; background: #1a1a1a; 
        border-radius: 12px; overflow: hidden; position: relative;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex; justify-content: space-between; align-items: center;
        padding: 15px 20px; background: #7c3aed; color: white;
    `;
    header.innerHTML = `
        <h3>🎬 ${movieTitle} - Trailer</h3>
        <button onclick="this.closest('div').parentElement.parentElement.remove()" 
                style="background:red; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">×</button>
    `;

    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = `
        position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;
    `;

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${trailerId}?autoplay=1`;
    iframe.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;
    `;
    iframe.allowFullscreen = true;
    iframe.title = `${movieTitle} Trailer`;

    iframeContainer.appendChild(iframe);
    player.appendChild(header);
    player.appendChild(iframeContainer);
    overlay.appendChild(player);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

function testMoviePlayer() {
    showMoviePlayer(550, "Fight Club");
}

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

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Movie player with YouTube trailers loaded!');
    setTimeout(addWatchButtons, 1000);
});