import json
import pytest
from sites.app import app

app.config['TESTING'] = True
client = app.test_client()


@pytest.fixture
def set_app_property():
    def set_func(data_directory='test/data/', book_file_name='book.csv', payments_file_name='payments.txt', years_file_name='years.txt'):
        app.DATA_DIRECTORY = data_directory
        app.BOOK_FILE_PATH = data_directory + book_file_name
        app.PAYMENTS_FILE_PATH = data_directory + payments_file_name
        app.YEARS_FILE_PATH = data_directory + years_file_name

    return set_func


def test_get_book(set_app_property):
    set_app_property(book_file_name='book.csv')
    result = client.get('/book-input')
    test_data = [
        {'index': '0', 'date': '2020-01-01', 'name': 'テスト1', 'amount': '1000'},
        {'index': '1', 'date': '2021-01-02', 'name': 'テスト2', 'amount': '2000'},
        {'index': '2', 'date': '2022-01-03', 'name': 'テスト3', 'amount': '3000'},
    ]

    assert json.loads(result.data.decode()) == json.loads(
        json.dumps(test_data))
    assert result.status == '200 OK'


def test_get_book_summary(set_app_property):
    set_app_property(book_file_name='book_test_summary.csv')
    result = client.get('/book-summary')
    test_data = [
        {'amount': 2000, 'name': 'テスト1', 'year': '2020'},
        {'amount': 2000, 'name': 'テスト2', 'year': '2020'},
    ]

    assert json.loads(result.data.decode()) == json.loads(
        json.dumps(test_data))
    assert result.status == '200 OK'


def test_get_years(set_app_property):
    set_app_property()
    result = client.get('/years')
    test_text = '\n2020\n2021\n2022'

    assert result.data == test_text.encode()
    assert result.status == '200 OK'


def test_get_payments(set_app_property):
    set_app_property()
    result = client.get('/payments')
    test_text = '\nテスト1\nテスト2\nテスト3'

    assert result.data == test_text.encode()
    assert result.status == '200 OK'


def test_update_entries(set_app_property):
    set_app_property(book_file_name='book_test_update.csv')
    test_data = [
        {'index': 0, 'date': '2020-01-01', 'name': 'テスト1', 'amount': 1000},
        {'index': 1, 'date': '2020-01-02', 'name': 'テスト2', 'amount': 2000},
        {'index': 2, 'date': '2020-01-03', 'name': 'テスト1', 'amount': 1000},
    ]
    result = client.post('/update', data=json.dumps(test_data),
                         content_type='application/json')

    assert result.status == '200 OK'
