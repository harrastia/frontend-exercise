import os.path
from flask import Flask
from flask import json
from flask import jsonify
from flask import Response
from flask import request
import random

SRC_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(SRC_DIR, 'data')
DRIVERS = []
TEAMS = []

app = Flask(__name__)

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/api/standings.json')
def standings():
    rnd_driver = random.randint(0, len(DRIVERS)-1)
    DRIVERS[rnd_driver]["points"] += 1
    resp = Response(json.dumps(DRIVERS), status=200, mimetype='application/json')
    return resp


@app.route('/api/team/<int:team_id>.json')
def team_details(team_id):
    team_info = False
    for team in TEAMS:
        if team["id"] == team_id:
            team_info = team
            break

    if team_info:
        resp = jsonify(team_info)
        resp.status_code = 200
        return resp

    return not_found()

@app.errorhandler(404)
def not_found(error=None):
    resp_data = {
            'status': 404,
            'message': 'Not Found: %s' % request.url,
    }
    resp = jsonify(resp_data)
    resp.status_code = 404

    return resp

if __name__ == '__main__':
    if not os.path.exists(os.path.join(DATA_DIR, "drivers.json")):
        raise "The drivers.json does not exist"

    if not os.path.exists(os.path.join(DATA_DIR, "teams.json")):
        raise "The teams.json does not exist"

    with open(os.path.join(DATA_DIR, "drivers.json")) as f_drivers:
        DRIVERS = json.loads(f_drivers.read())

    with open(os.path.join(DATA_DIR, "teams.json")) as f_teams:
        TEAMS = json.loads(f_teams.read())

    app.run(debug=True)