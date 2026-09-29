from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.api.routes import router
from app.config import settings

app = FastAPI(
    title="IP-SAKTI Sahayak (SIH26045)",
    description="A multilingual, RAG-based AI assistant for Intellectual Property and regulatory guidance in Ayurveda, across national and international regimes.",
    version="1.0.0"
)

# Enable CORS for frontend teammate integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

@app.get("/", include_in_schema=False)
def root():
    """Redirects to interactive Swagger API documentation."""
    return RedirectResponse(url="/docs")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
