#!/usr/bin/bash

pnpm build
cd dist
git init .
git add .
git commit -m "update: gh-pages content"
git remote add origin https://github.com/ocian/todo-mvc.git
git push origin main:gh-pages -f
echo "the end"