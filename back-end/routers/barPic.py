
from typing import List
from fastapi import APIRouter, HTTPException, status, File, UploadFile, Depends
from PIL import Image
from PIL.ExifTags import GPSTAGS, TAGS
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
    try:
        file_content = await source_file.read()
    except:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="File content cannot be read. File may be corrupt.")

    try:
        #Get ai response and parse for just the message
        ai_response = geminiConnection.image_analysis_call(file_content, source_file.content_type)
        ai_response = ""
        print(ai_response)

    except:
        raise HTTPException(status_code=status.HTTP_424_FAILED_DEPENDENCY, detail="AI response was unable to be retrieved and processed.")
    
    #Send details to NLX

