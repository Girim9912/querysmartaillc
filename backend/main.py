# main.py (updated)
from fastapi import FastAPI, UploadFile, Form, File, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3, os
from typing import Optional
from fastapi.staticfiles import StaticFiles
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# === APP SETUP ===
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to your domain in production, e.g., ["https://querysmartaillc.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve resumes folder publicly (read-only)
app.mount("/resumes", StaticFiles(directory="resumes"), name="resumes")

# === CONFIG ===
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "supersecrettoken")
EMAIL_USER = os.getenv("EMAIL_USER")  # e.g., your-email@gmail.com
EMAIL_PASS = os.getenv("EMAIL_PASS")  # App-specific password
EMAIL_TO = "careers@querysmartaillc.com"  # Where to send notifications
DB_PATH = "applications.db"
RESUME_DIR = "resumes"
os.makedirs(RESUME_DIR, exist_ok=True)

# === INIT DB ===
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    position TEXT,
    cover TEXT,
    resume_path TEXT
)
""")
conn.commit()
conn.close()

def check_auth(token: Optional[str]):
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")

def send_email(name: str, email: str, phone: str, position: str, cover: str, resume_path: str):
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = EMAIL_TO
    msg['Subject'] = f"New Application: {name} for {position}"

    body = f"Name: {name}\nEmail: {email}\nPhone: {phone}\nPosition: {position}\nCover: {cover}\nResume: {resume_path}"
    msg.attach(MIMEText(body, 'plain'))

    # Attach resume
    with open(resume_path, "rb") as attachment:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f"attachment; filename= {os.path.basename(resume_path)}")
        msg.attach(part)

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, EMAIL_TO, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Email error: {e}")  # Log; in production, use logging

# === ROUTES ===

@app.post("/api/apply")
async def apply(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    position: str = Form(...),
    cover: str = Form(...),
    resume: UploadFile = File(...)
):
    # NO AUTH HERE - Public endpoint

    # Save resume
    resume_filename = resume.filename.replace(" ", "_")  # Sanitize filename
    resume_path = os.path.join(RESUME_DIR, resume_filename)
    with open(resume_path, "wb") as f:
        f.write(await resume.read())

    # Save record
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO applications (name,email,phone,position,cover,resume_path) VALUES (?,?,?,?,?,?)",
        (name, email, phone, position, cover, resume_path)
    )
    conn.commit()
    conn.close()

    # Send email notification
    send_email(name, email, phone, position, cover, resume_path)

    return {"status": "Application saved"}

@app.get("/api/applications")
def list_applications(x_admin_token: Optional[str] = Header(None)):
    check_auth(x_admin_token)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id,name,email,phone,position,cover,resume_path FROM applications")
    rows = cursor.fetchall()
    conn.close()

    apps = []
    for r in rows:
        apps.append({
            "id": r[0],
            "name": r[1],
            "email": r[2],
            "phone": r[3],
            "position": r[4],
            "cover": r[5],
            "resume_url": f"/resumes/{os.path.basename(r[6])}"
        })
    return apps