from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from PIL import Image
import io
import torch
import numpy as np
import json
from transformers import CLIPProcessor, CLIPModel
=======
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import io
import psycopg2
import pandas as pd 
import json
import os
>>>>>>> 4ea9057 (full working ML pipeline)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
<<<<<<< HEAD
    allow_origins=["http://localhost:3000"],
=======
    allow_origins=["*"],
>>>>>>> 4ea9057 (full working ML pipeline)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
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
=======
model_id = "openai/clip-vit-base-patch32"
processor = CLIPProcessor.from_pretrained(model_id)
model = CLIPModel.from_pretrained(model_id)

df = pd.read_csv("train_label.csv")
landmark_lookup = dict(zip(df["landmark_id"], df["category"]))

def category_to_name(url):
    name = url.split("Category:")[-1]
    return name.replace("_", " ")

@app.get("/")
def read_root():
    return {"message": "LocateIt Backend is online!"}

@app.post("/search")
async def process_image(file: UploadFile = File(...)):
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model.vision_model(pixel_values=inputs["pixel_values"])
        pooled = outputs.pooler_output
        embedding = model.visual_projection(pooled)

    embedding = embedding[0].cpu().numpy().tolist()

    db_url = os.environ.get("DATABASE_URL")
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    emb_str = json.dumps(embedding)

    query = """
    WITH q AS (
        SELECT %s::vector AS query_vec
    )
    SELECT landmark_id,
           MAX(1 - (embedding <=> q.query_vec)) AS confidence
    FROM landmark_embeddings, q
    GROUP BY landmark_id
    ORDER BY confidence DESC
    LIMIT 5;
    """

    cur.execute(query, (emb_str,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    results = []
    for landmark_id, confidence in rows:
        category = landmark_lookup.get(landmark_id, "Unknown")
        landmark_name = category_to_name(category)

        results.append({
            "landmark_id": landmark_id,
            "landmark_name": landmark_name,
            "confidence": float(confidence)
        })

    return {"results": results} if results else {"message": "No match found"}
>>>>>>> 4ea9057 (full working ML pipeline)
