import io
import time
import requests
import pandas as pd
import numpy as np
import psycopg2
import torch

from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from psycopg2.extras import execute_batch

CSV_PATH                    = "top_10k.csv"
CHUNK_SIZE                  = 100
MIN_IMAGES                  = 7
MAX_IMAGES                  = 10
MIN_IMAGES_TO_CONSIDER_DONE = 7

DB_CONN = {
    "dbname":   "postgres",
    "user":     "postgres",
    "password": "mysecretpassword",
    "host":     "localhost",
    "port":     5432,
}

HEADERS = {
    
    "User-Agent": "LocateIt/1.0 (academic landmark-recognition project; contact: ruitongding@gmail.com)"
}


def chunked(lst: list, size: int):
    for i in range(0, len(lst), size):
        yield lst[i:i + size]


def download_image(url: str) -> Image.Image | None:
    try:
        time.sleep(0.5)
        r = requests.get(url, timeout=10, headers=HEADERS)
        
        if r.status_code != 200:
            return None
        return Image.open(io.BytesIO(r.content)).convert("RGB")
    except Exception:
        return None


def download_images_for_landmark(landmark_id: int, urls: list[str]):
    images = []
    for url in urls:
        img = download_image(url)
        if img is not None:
            images.append(img)
    
    return landmark_id, images


def get_already_processed(cur) -> set[int]:
    cur.execute("""
        SELECT landmark_id
        FROM landmark_embeddings
        GROUP BY landmark_id
        HAVING COUNT(*) >= %s
    """, (MIN_IMAGES_TO_CONSIDER_DONE,))
    return {row[0] for row in cur.fetchall()}


def normalize(v: np.ndarray) -> np.ndarray:
    return v / (np.linalg.norm(v) + 1e-10)


def flush_batch(cur, conn, db_batch: list, processed: int, skipped: int, start_time: float):
    execute_batch(
        cur,
        """
        INSERT INTO landmark_embeddings (landmark_id, embedding)
        VALUES (%s, %s)
        """,
        db_batch,
    )
    conn.commit()
    elapsed = (time.time() - start_time) / 60
    print(f"Processed: {processed:,} | Skipped: {skipped:,} | Elapsed: {elapsed:.1f} min")


def main():
    start_time = time.time()

    print("Loading CSV...")
    df = pd.read_csv(CSV_PATH)

    print(f"  Rows:      {len(df):,}")
    print(f"  Landmarks: {df['landmark_id'].nunique():,}")

    print("Connecting to PostgreSQL...")
    conn = psycopg2.connect(**DB_CONN)
    cur = conn.cursor()

    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS landmark_embeddings (
            embedding_id  BIGSERIAL PRIMARY KEY,
            landmark_id   BIGINT      NOT NULL,
            embedding     VECTOR(512) NOT NULL
        );
    """)
    conn.commit()

    already_done = get_already_processed(cur)

    grouped_df = df.groupby("landmark_id")
    all_landmark_ids = sorted(df["landmark_id"].unique())

    groups = [
        (lid, grouped_df.get_group(lid))
        for lid in all_landmark_ids
        if lid not in already_done
    ]

    groups = groups[:100]

    print(f"  Landmarks to process: {len(groups):,}")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    model_id  = "openai/clip-vit-base-patch32"
    processor = CLIPProcessor.from_pretrained(model_id)
    model     = CLIPModel.from_pretrained(model_id).to(device)
    model.eval()

    processed  = 0
    skipped    = 0
    failed_ids = []
    db_batch   = []

    for chunk in chunked(groups, CHUNK_SIZE):
        for landmark_id, group in chunk:
            try:
                urls = group["url"].tolist()[:MAX_IMAGES]
                landmark_id, images = download_images_for_landmark(landmark_id, urls)

                print(f"  Landmark {landmark_id}: {len(images)} images downloaded")

                if len(images) < MIN_IMAGES:
                    print(f"    → Skipped (only {len(images)} images, need {MIN_IMAGES})")
                    skipped += 1
                    continue

                inputs = processor(
                    images=images[:MAX_IMAGES],
                    return_tensors="pt",
                    padding=True,
                ).to(device)

                with torch.no_grad():
                    outputs = model.vision_model(
                        pixel_values=inputs["pixel_values"]
                    )

                    pooled = outputs.pooler_output
                    embs = model.visual_projection(pooled)

                embs = embs.cpu().numpy()

                for emb in embs:
                    db_batch.append((int(landmark_id), normalize(emb).tolist()))

                processed += 1

                
                if processed % 100 == 0:
                    flush_batch(cur, conn, db_batch, processed, skipped, start_time)
                    db_batch = []

            except Exception:
                import traceback
                traceback.print_exc()
                failed_ids.append(landmark_id)

    if db_batch:
        flush_batch(cur, conn, db_batch, processed, skipped, start_time)

    cur.close()
    conn.close()

    elapsed = (time.time() - start_time) / 60
    print(
        f"\nFinished.\n"
        f"  Processed: {processed:,}\n"
        f"  Skipped:   {skipped:,}\n"
        f"  Failed:    {len(failed_ids):,}\n"
        f"  Time:      {elapsed:.1f} min"
    )


if __name__ == "__main__":
    main()