import fiftyone.zoo as foz

dataset = foz.load_zoo_dataset(
    "open-images-v7",
    split="validation",
    label_types=["classifications"],
    classes=["Landmark"],
    max_samples=500,
)

print(dataset)
print(dataset.first())