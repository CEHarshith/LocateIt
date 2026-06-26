import pandas as pd

IMAGES_PER_LANDMARK = 20
TOP_LANDMARKS = 10000

clean_df = pd.read_csv("kaggle_cleaned.csv")
raw_train_df = pd.read_csv("train.csv")

clean_df["image_count"] = clean_df["images"].apply(
    lambda x: len(str(x).split(" "))
)


top_landmarks_df = (
    clean_df
    .sort_values(by="image_count", ascending=False)
    .head(TOP_LANDMARKS)
    .copy()
)


top_landmarks_df["id"] = top_landmarks_df["images"].apply(
    lambda x: str(x).split(" ")
)

exploded_df = top_landmarks_df.explode("id")

exploded_df["id"] = exploded_df["id"].astype(str)
raw_train_df["id"] = raw_train_df["id"].astype(str)

sampled_df = (
    exploded_df
    .groupby("landmark_id", group_keys=False)
    .head(IMAGES_PER_LANDMARK)
    .copy()
)

final_dataset = pd.merge(
    sampled_df[["landmark_id", "id"]],
    raw_train_df[["id", "url"]],
    on="id",
    how="inner"
)

final_dataset = final_dataset[
    final_dataset["landmark_id"] != 138982
]

final_dataset.to_csv(
    "top_10k_sampled_ready.csv",
    index=False
)

