from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from google import genai 
from google.genai import types
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SmartDigest AI Backend")

# 1. CORS: Updated to allow your Next.js frontend to communicate with this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Initialize the Gen AI Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_mime_type(url: str) -> str:
    """Helper to detect MIME type from Cloudinary URL extension"""
    ext = url.split('.')[-1].lower()
    mime_map = {
        'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
        'webp': 'image/webp', 'pdf': 'application/pdf', 
        'mp3': 'audio/mpeg', 'mp4': 'video/mp4'
    }
    return mime_map.get(ext, 'application/octet-stream')

@app.post("/analyze")
async def analyze(payload: dict = Body(...)):
    """
    Receives JSON: { "file_url": "...", "prompt": "..." }
    Downloads the file from Cloudinary and processes it via Gemini.
    """
    file_url = payload.get("file_url")
    prompt = payload.get("prompt")

    if not file_url or not prompt:
        raise HTTPException(status_code=400, detail="Missing file_url or prompt in request body")

    try:
        # 3. DOWNLOAD: Fetch the file bytes from the Cloudinary URL
        response = requests.get(file_url, timeout=15)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Could not download file from Cloudinary")
        
        file_bytes = response.content
        mime_type = get_mime_type(file_url)

        # 4. PROCESS: Run Multimodal Analysis using Gemini 2.0 Flash
        # We pass the bytes directly using types.Part.from_bytes
        ai_response = client.models.generate_content(
            model="gemini-2.0-flash-exp", 
            contents=[
                prompt,
                types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
            ]
        )
        
        result_text = ai_response.text if ai_response.text else "AI returned empty text."

        return {
            "success": True,
            "analysis": result_text
        }
    
    except Exception as e:
        print(f"Backend Error: {str(e)}")
        return {
            "success": False, 
            "analysis": f"AI Processing Error: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    # Matching your frontend expectation for port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)