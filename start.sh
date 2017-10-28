#!/bin/bash -e
jekyll serve --incremental &
echo $! > jekyll.pid
echo "Surf to http://localhost:4000"
echo "To stop jekyll and http-server, run ./stop.sh"
