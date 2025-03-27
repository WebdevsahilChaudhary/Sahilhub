document.addEventListener('DOMContentLoaded', function() {
    // Set the target time (7:30 PM today)
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(19, 30, 0, 0); // 7:30 PM
    
    // If it's already past 7:30 PM, set for next day
    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    // Debug logs
    console.log('Current time:', now);
    console.log('Target time:', targetTime);

    // Countdown function
    function updateCountdown() {
        const now = new Date();
        const diff = targetTime - now;
        
        console.log('Time difference (ms):', diff);
        
        if (diff <= 0) {
            // Time's up, show the video
            document.getElementById('countdown-container').style.display = 'none';
            document.getElementById('video-container').style.display = 'block';
            initializePlayer();
            clearInterval(countdownInterval);
            return;
        }
        
        // Calculate hours, minutes, seconds
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Update the display
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    // Initialize video player
    function initializePlayer() {
        const video = document.getElementById('video');
        const videoSrc = "https://myctxa.temycssme.wiki/720p.m3u8";
        
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play().catch(e => {
                    console.error("Autoplay failed:", e);
                    showError("Autoplay was prevented. Please click the play button to start the stream.");
                });
            });
            
            hls.on(Hls.Events.ERROR, function(event, data) {
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            showError("Network error. Please check your connection.");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            showError("Media error. Attempting to recover...");
                            hls.recoverMediaError();
                            break;
                        default:
                            showError("Unable to load the stream. Please try again later.");
                            break;
                    }
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', function() {
                video.play().catch(e => {
                    console.error("Autoplay failed:", e);
                    showError("Autoplay was prevented. Please click the play button to start the stream.");
                });
            });
        } else {
            showError("Your browser does not support live streaming.");
        }
    }

// Error reporting system
const reportBtn = document.getElementById('report-btn');
const errorForm = document.getElementById('error-form');

reportBtn.addEventListener('click', function() {
    errorForm.style.display = errorForm.style.display === 'none' ? 'block' : 'none';
});

// Optional: Add confirmation before form submits
errorForm.addEventListener('submit', function(e) {
    const errorMessage = document.getElementById('error-message').value.trim();
    if (!errorMessage) {
        e.preventDefault();
        showError("Please describe the issue before submitting.");
    } else {
        showConfirmation("Submitting your report...");
    }
});

function showConfirmation(message) {
    const confirmation = document.createElement('div');
    confirmation.className = 'confirmation-message';
    confirmation.textContent = message;
    confirmation.style.color = '#2ecc71';
    confirmation.style.margin = '1rem 0';
    confirmation.style.padding = '1rem';
    confirmation.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    confirmation.style.borderRadius = '5px';
    
    document.querySelector('main').prepend(confirmation);
    setTimeout(() => confirmation.remove(), 5000);
}

    // Start the countdown
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
});