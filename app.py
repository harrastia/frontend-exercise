import codecs
import copy
import json
import os.path
import random
from flask import Flask, jsonify

SRC_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(SRC_DIR, 'data')

# Load the files into global memory - points counters will be reset after reload.
with codecs.open(os.path.join(DATA_DIR, 'drivers.json'), 'r', 'UTF-8') as drivers_f:
    drivers = json.loads(drivers_f.read())

with codecs.open(os.path.join(DATA_DIR, 'teams.json'), 'r', 'UTF-8') as teams_f:
    teams = json.loads(teams_f.read())

app = Flask(__name__)


@app.route('/')
def home():
    return app.send_static_file('index.html')


def add_position(drivers):
    # If a driver has tied points with the previous one,
    # the position needs to be the same as the previous
    # driver's.
    prev_points = None
    prev_pos = None
    drivers = sorted(drivers, key=lambda x: x['points'], reverse=True)
    for pos, driver in enumerate(drivers):
        if prev_points != driver['points']:
            driver['position'] = prev_pos = pos + 1
            prev_points = driver['points']
        else:
            driver['position'] = prev_pos


def add_team_name(drivers):
    # For exercises sake, lets do a in-Python join between drivers
    # and teams. Nested loop is efficient enough for small amount
    # of items.
    for driver in drivers:
        for team in teams:
            if team['id'] == driver['team']:
                driver['team_name'] = team['team']


@app.route('/api/standings.json')
def standings():
    idx = random.randint(0, len(drivers) - 1)
    drivers[idx]['points'] += 1
    # Need to do a copy, as otherwise we would be altering the
    # global data (which we do want for the increment of points).
    drivers_copy = copy.deepcopy(drivers)
    add_position(drivers_copy)
    add_team_name(drivers_copy)
    return json.dumps(drivers_copy)


@app.route('/api/team/<int:team_id>.json')
def team_details(team_id):
    for item in teams:
        if item['id'] == team_id:
            return json.dumps(item)
    return jsonify(detail='Team ID %s not found'), 404

if __name__ == '__main__':
    app.run(debug=True)
