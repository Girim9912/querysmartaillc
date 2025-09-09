from fastapi import File, UploadFile, Form
import sqlite3, os

DB_PATH = "applications.db"
os.makedirs("resumes", exist_ok=True)

# Create DB table
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    position TEXT,
    cover TEXT,
    resume_path TEXT
)
""")
conn.commit()
@app.get("/api/applications")
def list_apps(x_admin_token: str = Header(None)):
    check_auth(x_admin_token)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name,email,phone,position,cover,resume_path FROM applications")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"name": r[0], "email": r[1], "phone": r[2], "position": r[3],
         "cover": r[4], "resume_url": "/"+r[5]}
        for r in rows
    ]

@app.post("/api/apply")
async def apply(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    position: str = Form(...),
    cover: str = Form(...),
    resume: UploadFile = File(...),
    x_admin_token: str = Header(None)


):
    check_auth(x_admin_token)

    # Save resume file
    file_path = f"resumes/{resume.filename}"
    with open(file_path, "wb") as f:
        f.write(await resume.read())

    # Insert into DB
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO applications (name,email,phone,position,cover,resume_path) VALUES (?,?,?,?,?,?)",
                   (name, email, phone, position, cover, file_path))
    conn.commit()
    conn.close()
    return {"status": "saved"}
