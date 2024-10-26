
from typing import List
from fastapi import APIRouter, HTTPException, status, File, UploadFile, Depends
from PIL import Image
from ai import geminiConnection
import json

router = APIRouter()

#Upload image and get gemimi response return.
@router.post("/upload/", status_code=status.HTTP_201_CREATED)
async def upload_file(source_file: UploadFile = File()):

    # Check file type and reject non image files   
    if(source_file.content_type.find("image/") == -1):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File type cannot be accepted")
    # Try to read file if possible. If any errors return exception.  
    image = Image.open(source_file.file)
    try:
        #Get ai response and parse for just the message
        ai_response = geminiConnection.image_analysis_call(image, source_file.content_type).text

    except:
        raise HTTPException(status_code=status.HTTP_424_FAILED_DEPENDENCY, detail="AI response was unable to be retrieved and processed.")
    ai_response = ai_response.replace("`","").replace("json","")
    ai_json = json.loads(ai_response)
    print(ai_response)

    return {"Response":ai_json}

