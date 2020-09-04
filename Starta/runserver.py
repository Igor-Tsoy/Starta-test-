from flask import Flask, request, render_template, jsonify
from flask_restful import Api, Resource, reqparse
from peewee import (SqliteDatabase, Model, CharField)

db = SqliteDatabase('calendar.db')

class Reserved(Model):
  class Meta:
    database = db
    db_table = 'reserved_dates'

  date = CharField()
  phone = CharField()

  def __str__(self):
    return "Забронированная дата {} \n По телефону {}".format(self.date, self.phone)

Reserved.create_table()
reserved_dates = dict()



app = Flask(__name__, static_folder="static")
api = Api(app)


@app.route('/', methods=['GET', 'POST'])
def calendar ():
  if request.method == "GET":
    return render_template('index.html')
  parser = reqparse.RequestParser()
  parser.add_argument("phone")
  parser.add_argument("dates")
  parsed = parser.parse_args()
  reserved_dates[parsed['phone']] = parsed['dates']
  row = Reserved(phone=parsed['phone'], date=parsed['dates'])
  row.save()
  return reserved_dates, 201

@app.route('/reserved', methods=['GET'])
def setReserved():
  all_reserved_dates = {'dates': []}

  for current in Reserved.select():
    all_reserved_dates['dates'].append(current.date)

  return all_reserved_dates

app.run(debug=True)