from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# السماح للفرونت (live server على 5500) إنه يحكي مع الباك (8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DNARequest(BaseModel):
    dna: str

@app.post("/api/echo-dna")
def echo_dna(payload: DNARequest):
    dna = payload.dna
    cleaned = (dna or "").strip().upper()

    if not cleaned:
        raise HTTPException(status_code=400, detail="DNA is empty")

    allowed = set("ACGT")
    invalid_chars = sorted({ch for ch in cleaned if ch not in allowed})

    if invalid_chars:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid DNA characters: {''.join(invalid_chars)}. Allowed: A, C, G, T"
        )

    note_map = {
        "A": "C4",
        "C": "D4",
        "G": "E4",
        "T": "G4",
    }

    notes = [note_map[ch] for ch in cleaned]

    return {
        "original": dna,
        "cleaned": cleaned,
        "length": len(cleaned),
        "notes": notes,
    }