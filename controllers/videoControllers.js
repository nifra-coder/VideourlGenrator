const mongoose = require('mongoose');

// Upload Video
const uploadVideo = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No video uploaded' });

    const bucket = req.app.locals.bucket;
    if (!bucket) return res.status(500).json({ error: 'GridFSBucket not initialized' });

    try {
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
        });
        uploadStream.end(req.file.buffer);

        uploadStream.on('finish', () => {
            const fileUrl = `${req.protocol}://${req.get('host')}/video/${uploadStream.filename}`;
            res.status(201).json({
                message: 'Video uploaded successfully',
                file: {
                    id: uploadStream.id,
                    filename: uploadStream.filename,
                    url: fileUrl,
                },
            });
        });
    } catch (err) {
        console.error('Error uploading video:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Stream Video
const streamVideo = async (req, res) => {
    const bucket = req.app.locals.bucket;
    if (!bucket) return res.status(500).json({ error: 'GridFSBucket not initialized' });

    try {
        const file = await mongoose.connection.db.collection('videos.files').findOne({ filename: req.params.filename });
        if (!file) return res.status(404).json({ error: 'Video not found' });

        res.setHeader('Content-Type', file.contentType);
        bucket.openDownloadStreamByName(req.params.filename).pipe(res);
    } catch (err) {
        console.error('Error fetching video:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete Video
const deleteVideo = async (req, res) => {
    const bucket = req.app.locals.bucket;
    if (!bucket) return res.status(500).json({ error: 'GridFSBucket not initialized' });

    try {
        await bucket.delete(new mongoose.Types.ObjectId(req.params.id));
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (err) {
        console.error('Error deleting video:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { uploadVideo, streamVideo, deleteVideo };
