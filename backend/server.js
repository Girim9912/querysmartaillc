import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Multer config for file uploads
const upload = multer({ dest: "uploads/" });

// 🔹 Careers application route
app.post("/api/apply", upload.single("resume"), async (req, res) => {
  try {
    const { fullname, email, phone, position, coverletter } = req.body;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ error: "Resume is required" });
    }

    // ✅ Setup email transport (using Brevo / Gmail SMTP)
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com", // Brevo free SMTP
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    // ✅ Send email with resume attached
    await transporter.sendMail({
      from: `"QuerySmart AI Careers" <careers@querysmartaillc.com>`,
      to: "careers@querysmartaillc.com", // 👈 HR team inbox
      subject: `New Job Application - ${position}`,
      text: `
        New job application received:

        Name: ${fullname}
        Email: ${email}
        Phone: ${phone}
        Position: ${position}

        Cover Letter:
        ${coverletter}
      `,
      attachments: [
        {
          filename: resumeFile.originalname,
          path: resumeFile.path,
        },
      ],
    });

    // Delete file after sending
    fs.unlinkSync(resumeFile.path);

    res.json({ success: true, message: "Application submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
