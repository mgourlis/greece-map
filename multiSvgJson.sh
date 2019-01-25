#!/bin/bash

for file in $(ls $1/*.svg)
do 
    echo $file
    no_ext=$(basename $file .svg)
    echo $no_ext
    cat $file | node `dirname $0`/svgJson.js > $no_ext.json
done