from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai 
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SmartDigest AI Backend")

# Allow your Next.js frontend to talk to this Python server
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

        # UPDATED MODEL ID: Must include '-preview' for the 2026 endpoints
        response = client.models.generate_content(
            model="gemini-3-flash-preview", 
            contents=[
                prompt,
                types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
            ],
            config=types.GenerateContentConfig(
                # Gemini 3 Thinking Configuration
                thinking_config=types.ThinkingConfig(
                    thinking_level=types.ThinkingLevel.MINIMAL 
                )
            )
        )
        
        return response.text if response.text else "AI returned empty text."
        
    except Exception as e:
        print(f"Gemini 3 Error: {str(e)}")
        # If it's still a 404, we'll see the exact message on the UI
        return f"AI Error: {str(e)}"

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), prompt: str = Form(...)):
    temp_path = f"temp_{file.filename}"
    
    try:
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        result = await process_multimodal_input(temp_path, file.content_type, prompt)
        return {"analysis": result}
    
    except Exception as e:
        return {"analysis": f"Backend Error: {str(e)}", "success": False}
    
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)