#!/bin/bash

ng build --prod
if [ $? -ne 0 ];then exit 1;fi

rm -rf ../frontend/*

dt="$(date)"
echo "# frontend  " > ../frontend/README.md
echo "Production frontend build  " >> ../frontend/README.md
echo $(git log|head -1)"  " >> ../frontend/README.md
echo $dt"  " >> ../frontend/README.md

echo "Copying files..."
cp -r dist/frontend/* ../frontend
cd ../frontend
git add *
git commit -a -m "$dt"
git push origin master
git status
cat README.md
cd ../admino_frontend
