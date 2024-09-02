const multer = require('multer')
const path = require('path')

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        const username = req.body.username || 'user' // Default to 'user' if username is not provided
        const date = new Date().toISOString().split('T')[0] // Format date as YYYY-MM-DD
        const ext = path.extname(file.originalname)
        const newFilename = `${username}_${date}_${Date.now()}${ext}`
        cb(null, newFilename)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

        if (mimetype && extname) {
            return cb(null, true)
        }
        cb('Error: PDFs, DOCs, and DOCXs only!')
    }
})

module.exports = upload
