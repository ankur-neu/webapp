#!/bin/bash

git add .
git commit -m "Changes in ssl options"

git push origin -f assignment8

git checkout  main
git pull origin -f assignment8
git push origin -f main
git checkout assignment8