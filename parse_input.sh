#!/bin/bash
cat $1 |
    grep "path(" |
    sed -e 's/var path_/"/g' |
    sed -e 's/ =/": /g' | 
    sed -e 's/rsr.path(//g' | 
    sed -e 's/).attr({/,/g'

