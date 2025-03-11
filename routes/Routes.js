const express = require('express');
const multer = require('multer');
const { uploadVideo, streamVideo, deleteVideo } = require('../controllers/videoControllers');

const router = express.Router();

// Multer configuration: Store files in memory, restrict to videos, and set size limit
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
    fileFilter: (req, file, cb) => {
        console.log('Received file:', file.originalname, file.mimetype);

        if (!file) {
            return cb(new Error('No file received'), false);
        }

        // ✅ Allow MP3 files along with videos
        const allowedMimeTypes = [
            'video/mp4', 'video/mkv', 'video/webm', 'video/avi', 'video/mov', 
            'audio/mpeg' // MP3 support
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            console.error(`Invalid file type: ${file.mimetype}`);
            return cb(new Error('Only video and MP3 files are allowed'), false);
        }
        
        cb(null, true);
    },
});


// Video upload route
router.post('/upload', upload.single('video'), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Invalid file type or no file uploaded' });
    }
    uploadVideo(req, res, next);
});

// Video streaming route
router.get('/:filename', streamVideo);

// Video deletion route
router.delete('/:id', deleteVideo);

module.exports = router;
