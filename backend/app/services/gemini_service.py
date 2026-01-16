import google.generativeai as genai
import os

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def process_multimodal_input(file_path, mime_type, prompt):
    # Gemini 1.5 can handle files directly
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # Upload file to Gemini API
    uploaded_file = genai.upload_file(path=file_path, mime_type=mime_type)
    
    # Generate content based on the file and your prompt
    response = model.generate_content([prompt, uploaded_file])
    return response.text