from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from google import genai 
from google.genai import types
import os
import shutil
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SmartDigest AI Backend")

# 1. SETUP STORAGE: Create a directory to store uploaded files permanently
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 2. MOUNT STATIC FILES: This allows the browser to see the images via URL
app.mount("/static", StaticFiles(directory="static"), name="static")

# 3. CORS: Allow your Next.js frontend (port 3000) to communicate with this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Gen AI Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def process_multimodal_input(file_path: str, mime_type: str, prompt: str):
    """Processes multimodal data using Gemini 3 Flash Preview"""
    try:
        with open(file_path, "rb") as f:
            file_bytes = f.read()

        response = client.models.generate_content(
            model="gemini-3-flash-preview", 
            contents=[
                prompt,
                types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
            ],
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(
                    thinking_level=types.ThinkingLevel.MINIMAL 
                )
            )
        )
        
        return response.text if response.text else "AI returned empty text."
        
    except Exception as e:
        print(f"Gemini 3 Error: {str(e)}")
        return f"AI Error: {str(e)}"

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), prompt: str = Form(...)):
    # 4. SAVE FILE: Store the file in the static directory
    # We use the original filename to keep the database and folder in sync
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # 5. PROCESS: Run AI Analysis
        result = await process_multimodal_input(file_path, file.content_type, prompt)
        
        # 6. RETURN URL: Send back the analysis AND the full URL for Neon
        generated_url = f"http://localhost:8000/static/uploads/{file.filename}"

        return {
            "analysis": result,
            "fileUrl": generated_url
        }
    
    except Exception as e:
        return {"analysis": f"Backend Error: {str(e)}", "success": False}