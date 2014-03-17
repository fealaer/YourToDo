#!/bin/bash
git checkout release
git merge master -q -m "Merge to release"
grunt build
git add dist -Af
git commit -m 'New Build'
git push heroku release:master
git checkout -