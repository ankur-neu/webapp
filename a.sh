#!/bin/bash

git add .
git commit -m "Chnages in app"

git push origin -f assignment7

git checkout  main
git pull origin -f assignment7
git push origin -f main
git checkout assignment7