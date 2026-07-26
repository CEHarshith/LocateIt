
from embeddings import chunked, normalize  # noqa: E402
import numpy as np


def test_category_to_name_strips_wiki_category_prefix(main_module):
    assert main_module.category_to_name(
        "https://commons.wikimedia.org/wiki/Category:Petronas_Towers"
    ) == "Petronas Towers"


def test_category_to_name_replaces_all_underscores(main_module):
    assert main_module.category_to_name(
        "Category:Golden_Gate_Bridge_San_Francisco"
    ) == "Golden Gate Bridge San Francisco"


def test_category_to_name_handles_url_with_no_category_segment(main_module):
    
    assert main_module.category_to_name("Golden_Gate_Bridge") == "Golden Gate Bridge"


def test_chunked_splits_list_into_fixed_size_pieces():
    assert list(chunked([1, 2, 3, 4, 5], 2)) == [[1, 2], [3, 4], [5]]


def test_chunked_handles_empty_list():
    assert list(chunked([], 3)) == []


def test_chunked_single_chunk_when_size_exceeds_length():
    assert list(chunked([1, 2], 10)) == [[1, 2]]



def test_normalize_produces_unit_length_vector():
    result = normalize(np.array([3.0, 4.0]))
    assert np.isclose(np.linalg.norm(result), 1.0)


def test_normalize_preserves_direction():
    result = normalize(np.array([2.0, 0.0]))
    assert np.allclose(result, [1.0, 0.0])


def test_normalize_handles_zero_vector_without_dividing_by_zero():

    result = normalize(np.array([0.0, 0.0]))
    assert not np.isnan(result).any()
