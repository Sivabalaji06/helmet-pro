const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');
const Violation = require('./models/Violation');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect('mongodb+srv://siva1718:asbabd1718@cluster0.lhhy22x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


// ===============================
// USER ROUTES
// ===============================

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'All fields are required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

    res.status(200).json({ message: 'Login successful', user });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ===============================
// VIOLATION ROUTES
// ===============================

app.post('/api/violations', upload.single('photo'), async (req, res) => {
  try {
    console.log('Incoming Violation Data:', req.body);
    console.log('Uploaded File:', req.file);

    const { type, plate, time, date, violation } = req.body;
    const photo = req.file?.filename;

    if (!type || !plate || !time || !date || !violation || !photo) {
      return res.status(400).json({ message: 'All fields including photo are required' });
    }

    const newViolation = new Violation({
      type,
      plate,
      time,
      date,
      violation,
      photo,
    });

    await newViolation.save();
    res.status(201).json({ message: 'Violation uploaded successfully' });

  } catch (error) {
    console.error('Violation upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET all violations
app.get('/api/violations', async (req, res) => {
  try {
    const violations = await Violation.find();
    res.json(violations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
