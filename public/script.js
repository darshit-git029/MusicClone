document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('.Play');
    const previousButton = document.querySelector('.Previous');
    const nextButton = document.querySelector('.Next');
    const audio = document.querySelector('audio');
    const img = document.querySelector('img');
    const title = document.querySelector('.title');
    const artist = document.querySelector('.artist');
    const progressSlider = document.querySelector('.progress_slider');
    const volumeSlider = document.querySelector('.volume_slider');

    let isPlaying = false;
    let songIndex = 0;
    let songs = [];

    // Fetch songs from the server
    async function fetchSongs() {
        try {
            const response = await fetch('/songs');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            songs = await response.json();
            loadSong(songs[songIndex]);
        } catch (err) {
            console.error('Error fetching songs:', err);
        }
    }

    function playMusic() {
        isPlaying = true;
        audio.play();
        playButton.classList.replace('fa-play', 'fa-pause');
        img.classList.add('anime');
    }

    function pauseMusic() {
        isPlaying = false;
        audio.pause();
        playButton.classList.replace('fa-pause', 'fa-play');
    }

    function togglePlay() {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }

    function loadSong(song) {
        title.textContent = song.title;
        artist.textContent = song.artist;
        audio.src = `/Music/${song.name}.mp4`;
        img.src = song.imageUrl; 
        progressSlider.value = 0;
        progressSlider.style.background = 'linear-gradient(to right, #ddd 0%, #ddd 100%)';
    }

    function nextSong() {
        songIndex = (songIndex + 1) % songs.length;
        loadSong(songs[songIndex]);
        playMusic();
    }

    function prevSong() {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        loadSong(songs[songIndex]);
        playMusic();
    }

    function setProgress() {
        audio.currentTime = audio.duration * (progressSlider.value / 100);
    }

    function updateProgress() {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressSlider.value = progress;
            progressSlider.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${progress}%, #ddd ${progress}%, #ddd 100%)`;
        }
    }

    function setVolume() {
        audio.volume = volumeSlider.value / 100;
    }

    playButton.addEventListener('click', togglePlay);
    nextButton.addEventListener('click', nextSong);
    previousButton.addEventListener('click', prevSong);
    progressSlider.addEventListener('input', setProgress);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    volumeSlider.addEventListener('input', setVolume);

    fetchSongs();
});
