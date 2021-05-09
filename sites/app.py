import csv
import json
from itertools import product

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


DATA_DIRECTORY = 'sites/static/data/'
BOOK_FILE_PATH = DATA_DIRECTORY + 'book.csv'
PAYMENTS_FILE_PATH = DATA_DIRECTORY + 'payments.txt'
YEARS_FILE_PATH = DATA_DIRECTORY + 'years.txt'
STATUS_OK = 200


@app.route('/index.html', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/medicine-input.html', methods=['GET'])
def medicine_input():
    return render_template('medicine-input.html')


@app.route('/medicine-summary.html', methods=['GET'])
def medicine_summary():
    return render_template('medicine-summary.html')


@app.route('/book-input', methods=['GET'])
def get_book():
    with open(BOOK_FILE_PATH, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        dicts = list(line for line in reader)
    return jsonify(dicts), STATUS_OK


@app.route('/book-summary', methods=['GET'])
def get_book_summary():
    with open(BOOK_FILE_PATH, 'r', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        entries = list(line for line in reader)

    years = get_text(YEARS_FILE_PATH).split('\n')[1:]
    payments = get_text(PAYMENTS_FILE_PATH).split('\n')[1:]
    summary = list()
    for year, payment in product(years, payments):
        def get_year_from_entry(entry):
            return entry[1][:4]

        def get_name_from_entry(entry):
            return entry[2]

        amount = sum(int(entry[3]) for entry in entries if (get_year_from_entry(
            entry) == year) and (get_name_from_entry(entry) == payment))
        if amount > 0:
            summary.append({'year': year, 'name': payment, 'amount': amount})

    return jsonify(summary), STATUS_OK


@app.route('/years', methods=['GET'])
def get_years():
    years = get_text(YEARS_FILE_PATH)
    return years, STATUS_OK


@app.route('/payments', methods=['GET'])
def get_payments():
    payments = get_text(PAYMENTS_FILE_PATH)
    return payments, STATUS_OK


def get_text(path):
    text = ''
    with open(path, 'r', encoding='utf-8') as file:
        text = ''.join(line for line in file)
    return text


@app.route('/update', methods=['POST'])
def update_entries():
    members = ('index', 'date', 'name', 'amount')
    with open(BOOK_FILE_PATH, 'w', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(members)
        for entry in request.json:
            if (entry['date'] != '') and (entry['name'] != '') and (entry['amount'] != 0):
                writer.writerow(entry[member] for member in members)

    return '', STATUS_OK


if __name__ == '__main__':
    app.run(debug=True)
