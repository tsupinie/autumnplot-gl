#!/bin/bash

DEVELOP_PATH=../autumplot-gl-develop
DOCUSAURUS_CONFIG=docusaurus.config.ts
VERSION=`cat package.json | grep '"version"' | sed 's/^.*"version": "\(.*\)".*$/\1/'`

echo "VERSION=$VERSION" > $GITHUB_ENV

# Build autumnplot-gl first
git branch develop remotes/origin/develop
git checkout develop
npm install
cd src/cpp
make js
cd ../..
npm run build-npm

# Copy it to another location to save it
cp -r . $DEVELOP_PATH

# Now check out the docusaurus site
git checkout -- package-lock.json
git checkout docusaurus
rm -rf node_modules

# Edit the docusaurus config to point to our local autumnplot-gl build
cat $DOCUSAURUS_CONFIG | sed "s:../autumnplot-gl/:$DEVELOP_PATH/:g" > $DOCUSAURUS_CONFIG.tmp
mv $DOCUSAURUS_CONFIG.tmp $DOCUSAURUS_CONFIG

# Now build the docusaurus site
npm install
npm install autumnplot-gl $DEVELOP_PATH

npm run build

# Now checkout the github pages branch
git checkout -- package.json package-lock.json $DOCUSAURUS_CONFIG
git branch gh-pages remotes/origin/gh-pages
git checkout gh-pages

# And add the docs we just created to the repo and commit
rm -rf docs 
mv build docs

git config --global user.email "tsupinie@gmail.com"
git config --global user.name "Tim Supinie (Docusaurus Deploy Bot)"

git add docs/
git commit -m "Update docs to v$VERSION"

# Finally, push to the original repo
git push origin gh-pages
git remote -v
git log