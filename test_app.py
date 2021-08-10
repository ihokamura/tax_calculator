import json
from sites.app import app

app.config['TESTING'] = True
app.DATA_DIRECTORY = 'test/data/'
app.BOOK_FILE_PATH = app.DATA_DIRECTORY + 'book.csv'
app.PAYMENTS_FILE_PATH = app.DATA_DIRECTORY + 'payments.txt'
app.YEARS_FILE_PATH = app.DATA_DIRECTORY + 'years.txt'
client = app.test_client()


def test_get_years():
    result = client.get('/years')
    test_text = '\n2020\n2021\n2022'

    assert result.data == test_text.encode()
    assert result.status == '200 OK'


def test_get_payments():
    result = client.get('/payments')
    test_text = '\nテスト1\nテスト2\nテスト3'

    assert result.data == test_text.encode()
    assert result.status == '200 OK'


def test_update_entries():
    test_data = [
        {'index': 0, 'date': '2020-01-01', 'name': 'テスト1', 'amount': 1000},
        {'index': 1, 'date': '2020-01-02', 'name': 'テスト2', 'amount': 2000},
        {'index': 2, 'date': '2020-01-03', 'name': 'テスト1', 'amount': 1000},
    ]
    result = client.post('/update', data=json.dumps(test_data),
                         content_type='application/json')

    assert result.status == '200 OK'


def test_get_book_summary():
    result = client.get('/book-summary')
    test_data = [
        {'amount': 2000, 'name': 'テスト1', 'year': '2020'},
        {'amount': 2000, 'name': 'テスト2', 'year': '2020'},
    ]

    assert json.loads(result.data.decode()) == json.loads(
        json.dumps(test_data))
    assert result.status == '200 OK'
