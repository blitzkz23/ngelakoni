#!/bin/bash
commit_message="$1"
origin="$2"

cd ..
git add .
git commit -m "$commit_message"
git push origin "$origin"

# how to run :
# ./git-commit.sh "enter message"