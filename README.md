# Exercise


A frontend-backend exercise.

The purpose of the exercise is demonstrate usage of basic Python skills and
intermediate skills of AngularJS.

For the backend use Flask to implement a basic JSON Rest API (read only) with
a bit of functionality. For the frontend showcase use of AngularJS consuming
the implemented JSON API in the backend and with some basic functionality to
display and interact with the data.

## The Problem

Create a simple racing standings board and display information about each of
the teams the pilots belong to.

### Backend

Create an API to list the current situation of the race, every
time the API is called, choose randomly a pilot and increment its points by 1.
Implement another API to provide the team by team ID. (Rest API call must return only 1 object)

Data for the drivers and teams is provided in the `data/` folder.

### Frontend

Using AngularJS and **angular-router** create 2 **views**, one containing the list of
pilots, their country and team and the current standings on the race.
Update the results every second.

In the list of standings every pilot must be selectable and redirect to another
view using angular-router containing information about the team the pilot
belongs to. Optionally display the position in the race of each of the pilots
for the team. Make some way to return to the standings list.

Other requirements/suggestions:

 * **Implement** at least a **filter**, a **service** and a **directive** using AngularJS.
 * **Write couple tests with any framework of choice.**
 * A little of UI candy is appreciated.

## Tips to get started

Install python in your system.

Install virtualenv for python https://pypi.python.org/pypi/virtualenv. This
step is optional but recommended, since it won't make available globally Flask
to your system, but only for this project. If not using virtualenv you can just
run:

    easy_install Flask

or

    pip install Flask

If using virtualenv, create a virtual environment in the cloned project folder.
Call it `env`:

    virtualenv env

Activate the virtual environment you will have to do this every time you get
back to the project:

    source env/bin/activate

Install the dependencies for the project:

    pip install -r requirements.txt

to run the app just do

    python app.py

the Flask server (in debug mode) will be running in port 5000. It loads in
its root the base HTML file to build on.

Install bower dependencies

    bower install

All yours, have fun!


PS: I have no idea of Formula1 or racing, just felt easy to propose a problem
and find real data for the examples.
