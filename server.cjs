const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use('/gallery', express.static(path.join(__dirname, 'gallery')));

// Multer setup for PNG uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'gallery/');
  },
  filename: function (req, file, cb) {
    // Save with unique timestamp name
    const ext = path.extname(file.originalname);
    cb(null, 'mask_' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload-mask', upload.single('mask'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // Get metadata from request body (name, adjectives)
  const name = req.body.name || '';
  let adjectives = [];
  try {
    if (req.body.adjectives) {
      adjectives = JSON.parse(req.body.adjectives);
    }
  } catch (e) {
    adjectives = [];
  }

  // Save metadata as JSON file
  const meta = { name, adjectives };
  const jsonPath = req.file.path.replace(/\.png$/, '.json');
  fs.writeFile(jsonPath, JSON.stringify(meta, null, 2), (err) => {
    if (err) {
      console.error('Failed to save metadata:', err);
      // Still return success for the image, but warn about metadata
      return res.json({ success: true, filename: req.file.filename, metaError: true });
    }
    res.json({ success: true, filename: req.file.filename });
  });
});

// List all PNGs in gallery
app.get('/gallery-list', (req, res) => {
  fs.readdir('gallery', (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read gallery' });
    const pngs = files.filter(f => f.endsWith('.png'));
    const result = pngs.map(filename => {
      const jsonPath = path.join('gallery', filename.replace(/\.png$/, '.json'));
      let name = '';
      let adjectives = [];
      try {
        if (fs.existsSync(jsonPath)) {
          const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          name = meta.name || '';
          adjectives = meta.adjectives || [];
        }
      } catch (e) {
        // ignore
      }
      return { filename, name, adjectives };
    });
    res.json(result);
  });
});

// Delete a mask from gallery
app.delete('/delete-mask/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'gallery', filename);
  
  // Security check: ensure filename only contains safe characters
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  
  fs.unlink(filepath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      }
      return res.status(500).json({ error: 'Failed to delete file' });
    }
    console.log('Deleted file:', filename);
    res.json({ success: true, message: 'File deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 