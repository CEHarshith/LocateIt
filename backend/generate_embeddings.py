import os
import torch
import numpy as np
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import json

# Load CLIP model
print("Loading CLIP model...")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model.eval()
print("Model loaded!")

DATA_DIR = "data"
embeddings = []
labels = []
image_paths = []

# Loop through each landmark folder
for landmark_name in os.listdir(DATA_DIR):
    landmark_dir = os.path.join(DATA_DIR, landmark_name)
    if not os.path.isdir(landmark_dir):
        continue

    print(f"Processing {landmark_name}...")

    for image_file in os.listdir(landmark_dir):
        if not image_file.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        image_path = os.path.join(landmark_dir, image_file)

        try:
            image = Image.open(image_path).convert("RGB")
            inputs = processor(images=image, return_tensors="pt")

            with torch.no_grad():
                outputs = model.get_image_features(**inputs)
                if hasattr(outputs, 'pooler_output'):
                 embedding = outputs.pooler_output
                else:
                 embedding = outputs
                embedding = embedding / embedding.norm(p=2, dim=-1, keepdim=True)

            embeddings.append(embedding.squeeze().numpy())
            labels.append(landmark_name)
            image_paths.append(image_path)

        except Exception as e:
            print(f"Error processing {image_path}: {e}")

# Save embeddings and labels
np.save("embeddings.npy", np.array(embeddings))

with open("labels.json", "w") as f:
    json.dump({"labels": labels, "image_paths": image_paths}, f)

print(f"Done! Generated {len(embeddings)} embeddings.")