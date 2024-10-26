from fastapi import FastAPI
from routers import barPic
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create FastAPI app and add middleware
app = FastAPI()

app.include_router(barPic.router)

@app.get('/')
async def redirect_docs():
    return RedirectResponse(url='/docs')

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)