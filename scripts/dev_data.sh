#! /bin/bash

# This script is used to prepare the dev data for the project.

for f in /Users/jileihao/data/avrspt/dist/bavcta008-tav48/cta/mdl/onemesh*.vtp; do
  echo "uploading file ${f}"
  curl -X POST -H "Content-Type: multipart/form-data" \
    -F "file=@$f" \
    -F "folder=./-1/single-model" \
    -F "filename=$(basename $f)" \
    -F "create_folder_if_not_exists=True" \
    -w "\n" \
    localhost:7070/data
done


for f in /Users/jileihao/data/avrspt/dist/bavcta008-tav48/cta/co/co_*_tri.vtp; do
  echo "uploading file ${f}"
  curl -X POST -H "Content-Type: multipart/form-data" \
    -F "file=@$f" \
    -F "folder=./-1/coaptation-surface" \
    -F "filename=$(basename $f)" \
    -F "create_folder_if_not_exists=True" \
    -w "\n" \
    localhost:7070/data
done
