// Movie Player Function for vidsrc.com integration
function showMoviePlayer(movieId, movieTitle) {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        padding: 20px;
    `;

    // Create movie player container
    const playerContainer = document.createElement('div');
    playerContainer.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 800px;
        background: #1a1a1a;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.7);
    `;

    // Create header with title and close button
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: #2d2d2d;
        border-bottom: 1px solid #444;
    `;

    const title = document.createElement('h3');
    title.textContent = `🎬 Watching: ${movieTitle}`;
    title.style.cssText = `
        color: #c084fc;
        margin: 0;
        font-size: 1.2rem;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        background: #ff4757;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    closeBtn.onclick = () => document.body.removeChild(overlay);

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = `
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
    `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://vidsrc.com/embed/${movieId}`;
    iframe.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 0 0 8px 8px;
    `;
    iframe.allowFullscreen = true;
    iframe.title = `${movieTitle} Player`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

    iframeContainer.appendChild(iframe);

    // Assemble the player
    playerContainer.appendChild(header);
    playerContainer.appendChild(iframeContainer);
    overlay.appendChild(playerContainer);

    // Add to page
    document.body.appendChild(overlay);

    // Close on ESC key
    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
        }
    });
    overlay.focus();

    // Close on background click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// Function to add watch buttons to movie cards
function addWatchButtons() {
    // This will depend on your current movie card structure
    // You'll need to modify this based on your HTML
    const movieCards = document.querySelectorAll('.media-card'); // Adjust selector
    
    movieCards.forEach(card => {
        const movieId = card.getAttribute('data-movie-id');
        const movieTitle = card.getAttribute('data-movie-title') || 'Movie';
        
        if (movieId) {
            const watchBtn = document.createElement('button');
            watchBtn.textContent = '🎬 Watch Now';
            watchBtn.style.cssText = `
                background: linear-gradient(45deg, #7c3aed, #c084fc);
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 10px;
                transition: transform 0.2s;
            `;
            
            watchBtn.onmouseover = () => watchBtn.style.transform = 'scale(1.05)';
            watchBtn.onmouseout = () => watchBtn.style.transform = 'scale(1)';
            
            watchBtn.onclick = () => showMoviePlayer(movieId, movieTitle);
            
            card.appendChild(watchBtn);
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    addWatchButtons();
});