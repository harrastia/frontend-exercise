# -*- encoding: UTF-8 -*-
from app import app, drivers
import unittest
import json


class FlaskrTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        # Make sure tests don't interfere with each other by resetting
        # the points counter.
        for item in drivers:
            item['points'] = 0

    def test_standings_single(self):
        response = json.loads(self.app.get('api/standings.json').data)
        pos_increment_found = any(item['points'] > 0 for item in response)
        self.assertTrue(pos_increment_found)

    def test_standings_multiple(self):
        for i in range(0, 20):
            response = json.loads(self.app.get('api/standings.json').data)
        pos_increment_count = sum(item['points'] for item in response)
        self.assertEqual(pos_increment_count, 20)

    def test_standings_team_data(self):
        response = json.loads(self.app.get('api/standings.json').data)
        nico_data = response[2]
        self.assertEqual(nico_data['driver'], 'Nico Rosberg')
        self.assertEqual(nico_data['team_name'], 'Mercedes AMG Petronas F1 Team')

    def test_team_data(self):
        response = self.app.get('api/team/1.json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['car'], 'Ferrari 059/3')

    def test_team_invalid_id(self):
        response = self.app.get('api/team/11.json')
        self.assertEqual(response.status_code, 404)

    def test_team_invalid_id_str(self):
        response = self.app.get('api/team/foo.json')
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()
