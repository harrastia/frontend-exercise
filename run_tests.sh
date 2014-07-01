#!/bin/bash

# Usually need to use grunt or gulp task runnner.

# make local npm binaries available
PATH=./node_modules/karma/bin/:./node_modules/protractor/bin:$PATH

if [ ! -f './node_modules/karma/bin/karma' ];
then
  echo "Should install karma test framework"
  exit 1
fi

if [ ! -f './env/bin/activate' ]; then
  echo "Did you install env?"
  echo "If so then run 'source env/bin/activate'"
fi

echo "Run unit test"
karma start karma.conf.js

echo "Run e2e test"
webdriver-manager start &

echo "Wait 3 sec before run e2e test"
sleep 3
protractor protractor.conf.js