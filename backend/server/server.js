// server/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/resumes', express.static('resumes')); // Serve resumes publicly
const upload = multer({
  storage: multer.diskStorage({
    destination: './resumes',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Only PDF and DOCX files are allowed'));
  },
});

// SQLite setup
const db = new sqlite3.Database('applications.db', (err) => {
  if (err) console.error('Database error:', err);
  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      position TEXT,
      cover TEXT,
      resume_path TEXT
    )
  `);
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact Form Route
app.post('/contact', async (req, res) => {
  const { name, email, company, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'contact@querysmartaillc.com',
    subject: `New Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Careers Form Route
app.post('/apply', upload.single('resume'), async (req, res) => {
  const { name, email, phone, position, cover } = req.body;
  const resume = req.file;

  if (!name || !email || !phone || !position || !cover || !resume) {
    return res.status(400).json({ error: 'All fields and resume are required' });
  }

  const resumePath = `resumes/${resume.filename}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'careers@querysmartaillc.com',
    subject: `New Application from ${name} for ${position}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nPosition: ${position}\nCover: ${cover}`,
    attachments: [{ filename: resume.originalname, path: resume.path }],
  };

  try {
    // Save to SQLite
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO applications (name, email, phone, position, cover, resume_path) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, phone, position, cover, resumePath],
        (err) => (err ? reject(err) : resolve())
      );
    });

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process application' });
  }
});

// Optional: Admin route to list applications (protected by token)
app.get('/applications', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  db.all('SELECT id, name, email, phone, position, cover, resume_path FROM applications', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        position: row.position,
        cover: row.cover,
        resume_url: `/${row.resume_path}`,
      }))
    );
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));