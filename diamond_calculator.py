from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, conlist
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import math

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to the Diamond Calculator API!"}

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiamondGroup(BaseModel):
    carat: float
    quantity: int
    cut: str
    color: str
    clarity: str
    certification: str

class CalculationRequest(BaseModel):
    groups: List[DiamondGroup]

class GroupResult(BaseModel):
    group_id: int
    per_diamond: float
    total: float
    details: dict

class CalculationResponse(BaseModel):
    results: List[GroupResult]
    grand_total: float

# Price multipliers
CUT_MULTIPLIERS = {
    'excellent': 1.3,
    'very-good': 1.2,
    'good': 1.1,
    'fair': 1.0,
    'poor': 0.9
}

COLOR_MULTIPLIERS = {
    'D': 1.3,
    'E': 1.25,
    'F': 1.2,
    'G': 1.15,
    'H': 1.1,
    'I': 1.05,
    'J': 1.0
}

CLARITY_MULTIPLIERS = {
    'FL': 1.5,
    'IF': 1.4,
    'VVS1': 1.3,
    'VVS2': 1.25,
    'VS1': 1.2,
    'VS2': 1.15,
    'SI1': 1.1,
    'SI2': 1.05
}

CERTIFICATION_MULTIPLIERS = {
    'GIA': 1.2,
    'AGS': 1.15,
    'IGI': 1.1,
    'HRD': 1.1,
    'uncertified': 0.9
}

def calculate_diamond_price(group: DiamondGroup) -> float:
    """Calculate price for a single diamond based on its characteristics."""
    base_price = 3500

    if group.cut.lower() not in CUT_MULTIPLIERS:
        raise HTTPException(status_code=400, detail=f"Invalid cut grade: {group.cut}")
    if group.color not in COLOR_MULTIPLIERS:
        raise HTTPException(status_code=400, detail=f"Invalid color grade: {group.color}")
    if group.clarity not in CLARITY_MULTIPLIERS:
        raise HTTPException(status_code=400, detail=f"Invalid clarity grade: {group.clarity}")
    if group.certification not in CERTIFICATION_MULTIPLIERS:
        raise HTTPException(status_code=400, detail=f"Invalid certification: {group.certification}")
    
    price = base_price * group.carat
    price *= CUT_MULTIPLIERS[group.cut.lower()]
    price *= COLOR_MULTIPLIERS[group.color]
    price *= CLARITY_MULTIPLIERS[group.clarity]
    price *= CERTIFICATION_MULTIPLIERS[group.certification]
    price *= math.pow(group.carat, 0.8)  
    
    return price

@app.post("/calculate", response_model=CalculationResponse)
async def calculate_prices(request: CalculationRequest):
    results = []
    grand_total = 0
    
    for i, group in enumerate(request.groups):
        try:
            per_diamond = calculate_diamond_price(group)
            total = per_diamond * group.quantity
            grand_total += total
            
            results.append(GroupResult(
                group_id=i + 1,
                per_diamond=round(per_diamond, 2),
                total=round(total, 2),
                details={
                    "quantity": group.quantity,
                    "carat": group.carat,
                    "cut": group.cut,
                    "color": group.color,
                    "clarity": group.clarity,
                    "certification": group.certification
                }
            ))
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    return CalculationResponse(
        results=results,
        grand_total=round(grand_total, 2)
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}