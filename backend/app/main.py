from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from google import genai 
from google.genai import types
import requests
import os
from dotenv import load_dotenv
from openai import OpenAI

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

# 2. Initialize the Gemini & DeepSeek Clients
# On Render, you will add GEMINI_API_KEY and DEEPSEEK_API_KEY to the Environment Variables dashboard
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

deepseek_client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

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
    If file_url is provided, uses Gemini 2.0 Flash for multimodal processing.
    If no file_url is provided, uses DeepSeek API for text-only to save Gemini rate limits.
    """
    file_url = payload.get("file_url")
    prompt = payload.get("prompt")

    if not prompt:
        raise HTTPException(status_code=400, detail="Missing prompt")

    try:
        if file_url:
            # MULTIMODAL: Use Gemini Pro as requested for file handling
            # 3. Download bytes from Cloudinary
            response = requests.get(file_url, timeout=15)
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Cloudinary download failed")
            
            file_bytes = response.content
            mime_type = get_mime_type(file_url)

            # 4. Generate Content with Gemini
            ai_response = gemini_client.models.generate_content(
                model="gemini-2.0-flash", 
                contents=[
                    prompt,
                    types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
                ]
            )
            result_text = ai_response.text if ai_response.text else "AI empty response"
        else:
            # TEXT-ONLY: Use DeepSeek API to save Gemini limits
            ai_response = deepseek_client.chat.completions.create(
                model="deepseek/deepseek-r1",
                messages=[
                    {"role": "user", "content": prompt},
                ],
                stream=False
            )
            result_text = ai_response.choices[0].message.content

        return {
            "success": True,
            "analysis": result_text
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