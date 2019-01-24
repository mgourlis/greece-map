#!/bin/bash
cat $1 |
    grep "push" |
    sed -e 's/path_/"/g' |
    sed -e 's/,/",/g' |
    sed -e 's/rsr.path(//g' | 
    # sed -e 's/).attr({/,/g'

