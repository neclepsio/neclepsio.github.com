#! /bin/sh

git submodule update --init --remote
git add .
git commit -m "Sync with upstream"
git push