const router = require(`express`).Router()
const upload = require('../uploads/upload')

router.post('/upload', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    res.json({ message: 'File uploaded successfully!' });
});

module.exports = router