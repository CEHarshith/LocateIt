
import sys
import types
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))


class _FakeTensor:
    """Stand-in for a torch.Tensor, exposing only what main.py actually
    calls on it: indexing, .cpu(), .numpy(), .tolist()."""

    def __init__(self, array):
        self._array = np.asarray(array, dtype="float32")

    def __getitem__(self, idx):
        return _FakeTensor(self._array[idx])

    def cpu(self):
        return self

    def numpy(self):
        return self._array

    def tolist(self):
        return self._array.tolist()


class _FakeVisionOutput:
    def __init__(self, pooler_output):
        self.pooler_output = pooler_output


class _FakeCLIPModel:
   
    @classmethod
    def from_pretrained(cls, model_id):
        return cls()

    def vision_model(self, pixel_values=None):
        return _FakeVisionOutput(pooler_output=_FakeTensor(np.zeros((1, 768))))

    def visual_projection(self, pooled):
        return _FakeTensor(np.full((1, 512), 0.1))


class _FakeCLIPProcessor:
    
    @classmethod
    def from_pretrained(cls, model_id):
        return cls()

    def __call__(self, images=None, return_tensors="pt", **kwargs):
        return {"pixel_values": _FakeTensor(np.zeros((1, 3, 224, 224)))}


class _FakeNoGrad:
    def __enter__(self):
        return None

    def __exit__(self, *exc):
        return False


def _install_fake_torch_and_transformers():
    fake_torch = types.ModuleType("torch")
    fake_torch.no_grad = _FakeNoGrad
    sys.modules["torch"] = fake_torch

    fake_transformers = types.ModuleType("transformers")
    fake_transformers.CLIPModel = _FakeCLIPModel
    fake_transformers.CLIPProcessor = _FakeCLIPProcessor
    sys.modules["transformers"] = fake_transformers


_install_fake_torch_and_transformers()


FAKE_LANDMARK_ROWS = pd.DataFrame({
    "landmark_id": [1001, 1002],
    "category": [
        "https://commons.wikimedia.org/wiki/Category:Petronas_Towers",
        "https://commons.wikimedia.org/wiki/Category:Niagara_Falls",
    ],
})


@pytest.fixture(scope="session")
def main_module():

    import importlib

    real_read_csv = pd.read_csv

    def _fake_read_csv(path, *args, **kwargs):
        if str(path).endswith("train_label.csv"):
            return FAKE_LANDMARK_ROWS.copy()
        return real_read_csv(path, *args, **kwargs)

    pd.read_csv = _fake_read_csv
    try:
        sys.modules.pop("main", None)
        module = importlib.import_module("main")
    finally:
        pd.read_csv = real_read_csv

    return module


@pytest.fixture
def client(main_module):
    from fastapi.testclient import TestClient
    return TestClient(main_module.app)


@pytest.fixture
def fake_db(main_module, monkeypatch):

    class _FakeCursor:
        def __init__(self):
            self.rows = []

        def execute(self, query, params=None):
            pass

        def fetchall(self):
            return self.rows

        def close(self):
            pass

    class _FakeConnection:
        def __init__(self):
            self._cursor = _FakeCursor()

        def cursor(self):
            return self._cursor

        def close(self):
            pass

    fake_conn = _FakeConnection()
    monkeypatch.setattr(main_module.psycopg2, "connect", lambda *a, **k: fake_conn)
    return fake_conn
