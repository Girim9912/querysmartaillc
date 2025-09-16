from fastapi import FastAPI, UploadFile, Form, File, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3, os
from typing import Optional
from fastapi.staticfiles import StaticFiles


# === APP SETUP ===
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to your domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve resumes folder publicly (read-only)
app.mount("/resumes", StaticFiles(directory="resumes"), name="resumes")

# === CONFIG ===
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "supersecrettoken")
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

# === ROUTES ===

@app.post("/api/apply")
async def apply(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    position: str = Form(...),
    cover: str = Form(...),
    resume: UploadFile = File(...),
    x_admin_token: Optional[str] = Header(None)
):
    check_auth(x_admin_token)

    # Save resume
    resume_path = os.path.join(RESUME_DIR, resume.filename)
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
            "resume_url": f"/{r[6]}",
            "resume_url": f"/resumes/{os.path.basename(r[6])}"
        })
    return apps
