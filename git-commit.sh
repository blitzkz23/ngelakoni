#!/bin/bash
commit_message="$1"

git add .
git commit -m "$commit_message"
git push origin main

# how to run :
# ./git-commit.sh "enter message"