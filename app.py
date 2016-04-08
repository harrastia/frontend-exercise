import codecs
import copy
import json
import os.path
import random
from flask import Flask, jsonify

SRC_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(SRC_DIR, 'data')

# I'll load the files in memory for this exercise, usage
# of real database would of course be a more solid approach,
# but it is probably overkill for the purposes of fulfilling
# this exercise.
with codecs.open(os.path.join(DATA_DIR, 'drivers.json'), 'r', 'UTF-8') as drivers_f:
    drivers = json.loads(drivers_f.read())

with codecs.open(os.path.join(DATA_DIR, 'teams.json'), 'r', 'UTF-8') as teams_f:
    teams = json.loads(teams_f.read())

app = Flask(__name__)


@app.route('/')
def home():
    return app.send_static_file('index.html')


@app.route('/api/standings.json')
def standings():
    idx = random.randint(0, len(drivers) - 1)
    drivers[idx]['points'] += 1
    # For exercises sake, lets do a in-Python join between drivers
    # and teams. Nested loop is efficient enough for small amount
    # of items.
    # Need to do a copy, as otherwise we would be altering the
    # global data (which we do want for the increment of points).
    drivers_copy = copy.deepcopy(drivers)
    for driver in drivers_copy:
        for team in teams:
            if team['id'] == driver['team']:
                driver['team_name'] = team['team']
    return json.dumps(drivers_copy)


@app.route('/api/team/<int:team_id>.json')
def team_details(team_id):
    for item in teams:
        if item['id'] == team_id:
            return json.dumps(item)
    return jsonify(detail='Team ID %s not found'), 404

if __name__ == '__main__':
    app.run(debug=True)
