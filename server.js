const express = require('express');``
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const MUSIC_DIR = path.join(__dirname, 'Music');
const IMAGES_DIR = path.join(__dirname, 'images');


app.use(express.static(path.join(__dirname, 'public')));

app.use('/Music', express.static(MUSIC_DIR));

app.use('/images', express.static(IMAGES_DIR));

app.get('/songs', (req, res) => {
    fs.readdir(MUSIC_DIR, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to read music directory');
        }

        const songs = files.filter(file => file.endsWith('.mp4')).map(file => {
            const songName = path.basename(file, '.mp4');
            const imagePath = path.join(IMAGES_DIR, `${songName}.jpg`);
            const imageExists = fs.existsSync(imagePath);
            const randomImageNumber = Math.floor(Math.random() * 1000); 
            const placeholderText = encodeURIComponent(`No Image - ${songName}`);
            return {
                name: songName,
                title: songName,
                artist: 'Unknown Artist',
                imageUrl: imageExists ? `/images/${songName}.jpg`: `https://picsum.photos/300/300?random=${randomImageNumber}`
            };
        });

        res.json(songs);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
