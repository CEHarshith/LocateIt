import io

import pytest
from PIL import Image, UnidentifiedImageError


def _sample_image_bytes():
   
    img = Image.new("RGB", (32, 32), color=(120, 180, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf


def test_root_endpoint_reports_online(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "LocateIt Backend is online!"}


def test_search_returns_ranked_results_with_known_landmarks(client, fake_db):
    fake_db.cursor().rows = [(1001, 0.873), (1002, 0.412)]

    response = client.post(
        "/search",
        files={"file": ("photo.png", _sample_image_bytes(), "image/png")},
    )

    assert response.status_code == 200
    assert response.json()["results"] == [
        {"landmark_id": 1001, "landmark_name": "Petronas Towers", "confidence": 0.873},
        {"landmark_id": 1002, "landmark_name": "Niagara Falls", "confidence": 0.412},
    ]


def test_search_reports_no_match_when_db_returns_nothing(client, fake_db):
    fake_db.cursor().rows = []

    response = client.post(
        "/search",
        files={"file": ("photo.png", _sample_image_bytes(), "image/png")},
    )

    assert response.status_code == 200
    assert response.json() == {"message": "No match found"}


def test_search_falls_back_to_unknown_for_unrecognised_landmark_id(client, fake_db):
    fake_db.cursor().rows = [(9999, 0.5)]  

    response = client.post(
        "/search",
        files={"file": ("photo.png", _sample_image_bytes(), "image/png")},
    )

    assert response.json()["results"][0]["landmark_name"] == "Unknown"


def test_search_results_are_ordered_as_returned_by_the_db(client, fake_db):
    fake_db.cursor().rows = [(1002, 0.9), (1001, 0.3)]

    response = client.post(
        "/search",
        files={"file": ("photo.png", _sample_image_bytes(), "image/png")},
    )

    names = [r["landmark_name"] for r in response.json()["results"]]
    assert names == ["Niagara Falls", "Petronas Towers"]


def test_search_with_corrupted_image_currently_raises_unhandled_exception(client, fake_db):
    with pytest.raises(UnidentifiedImageError):
        client.post(
            "/search",
            files={"file": ("not-an-image.txt", io.BytesIO(b"not a real image"), "text/plain")},
        )
