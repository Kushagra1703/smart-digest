from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from google import genai 
from google.genai import types
import requests
import os
from dotenv import load_dotenv

# Load environment variables for local testing
load_dotenv()

app = FastAPI(title="SmartDigest AI Backend")

# 1. UPDATED CORS: Add your Vercel URL here once it is live
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-project-name.vercel.app" # Replace with your actual Vercel URL
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Initialize the Gemini Client
# On Render, you will add GEMINI_API_KEY to the Environment Variables dashboard
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_mime_type(url: str) -> str:
    """Detects MIME type from Cloudinary URL"""
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
    Downloads file from Cloudinary and processes with Gemini 2.0 Flash
    """
    file_url = payload.get("file_url")
    prompt = payload.get("prompt")

    if not file_url or not prompt:
        raise HTTPException(status_code=400, detail="Missing file_url or prompt")

    try:
        # 3. Download bytes from Cloudinary
        response = requests.get(file_url, timeout=15)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Cloudinary download failed")
        
        file_bytes = response.content
        mime_type = get_mime_type(file_url)

        # 4. Generate Content
        ai_response = client.models.generate_content(
            model="gemini-2.0-flash-exp", 
            contents=[
                prompt,
                types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
            ]
        )
        
        return {
            "success": True,
            "analysis": ai_response.text if ai_response.text else "AI empty response"
        }
    
    except Exception as e:
        print(f"Server Error: {str(e)}")
        return {"success": False, "analysis": f"AI Error: {str(e)}"}

# 5. DYNAMIC PORT: Critical for Cloud Hosting
if __name__ == "__main__":
    import uvicorn
    # Render provides a $PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)