#! /bin/sh

git submodule update --remote
git add .
git commit -m "Sync with upstream"
git push