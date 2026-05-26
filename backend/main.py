from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import numpy as np
import json
from transformers import CLIPProcessor, CLIPModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CLIP model
print("Loading CLIP model...")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model.eval()

# Load precomputed embeddings
embeddings = np.load("embeddings.npy")
with open("labels.json", "r") as f:
    data = json.load(f)
labels = data["labels"]
image_paths = data["image_paths"]
print(f"Loaded {len(labels)} embeddings!")

def get_embedding(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model.get_image_features(**inputs)
        if hasattr(outputs, 'pooler_output'):
            embedding = outputs.pooler_output
        else:
            embedding = outputs
        embedding = embedding / embedding.norm(p=2, dim=-1, keepdim=True)
    return embedding.squeeze().numpy()

@app.get("/")
def root():
    return {"message": "LocateIt API is running"}

@app.post("/search")
async def search(file: UploadFile = File(...)):
    contents = await file.read()
    query_embedding = get_embedding(contents)

    # Compute cosine similarity against all embeddings
    similarities = np.dot(embeddings, query_embedding)

    # Get top 3 results
    top_k = 3
    top_indices = np.argsort(similarities)[::-1][:top_k]

    results = []
    for i in top_indices:
        results.append({
            "landmark": labels[i],
            "confidence": float(similarities[i]),
            "image_path": image_paths[i]
        })

    return {"results": results}