#!/bin/bash -e
if ! [ -e jekyll.pid ]; then
  echo "Jekyll not started"
else
  kill $(cat jekyll.pid)
  rm jekyll.pid
  echo "Killed jekyll"
fi
