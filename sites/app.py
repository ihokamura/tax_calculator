import csv
import json

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


DATA_DIRECTORY = 'sites/static/data/'
STATUS_OK = 200


@app.route('/index.html', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/medicine.html', methods=['GET', 'POST'])
def medicine():
    return render_template('medicine.html')


@app.route('/book', methods=['GET', 'POST'])
def get_book():
    with open(DATA_DIRECTORY + 'book.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        dicts = list(line for line in reader)
    return jsonify(dicts), STATUS_OK


@app.route('/years', methods=['GET'])
def get_years():
    years = get_text(DATA_DIRECTORY + 'years.txt')
    return years, STATUS_OK


@app.route('/payments', methods=['GET'])
def get_payments():
    payments = get_text(DATA_DIRECTORY + 'payments.txt')
    return payments, STATUS_OK


def get_text(path):
    text = ''
    with open(path, 'r', encoding='utf-8') as file:
        text = ''.join(line for line in file)
    return text


@app.route('/update', methods=['POST'])
def update_entries():
    members = ('index', 'date', 'name', 'amount')
    with open(DATA_DIRECTORY + 'book.csv', 'w', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(members)
        for entry in request.json:
            if entry['date'] != '':
                writer.writerow(entry[member] for member in members)

    return '', STATUS_OK


if __name__ == '__main__':
    app.run(debug=True)
