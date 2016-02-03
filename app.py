import os.path
from flask import Flask

SRC_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(SRC_DIR, 'data')

app = Flask(__name__)

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/api/standings.json')
def standings():
    # TODO: Implement
    pass


@app.route('/api/team/<int:team_id>.json')
def team_details(team_id):
    # TODO: Implement
    pass

if __name__ == '__main__':
    app.run(debug=True)
