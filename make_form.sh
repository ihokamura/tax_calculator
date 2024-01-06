#!/bin/bash

year=$1
input_directory=sites/static/data
output_file=form.csv
cat $input_directory/book.csv | grep "$year" | awk -F, '{a[$3]+=$4}END{for (k in a){print k,a[k]}}' | sort | join <(sort $input_directory/mapping.txt) - | sed 's/ /,/g' | sed 's/診療・治療/&,,,/g;s/医薬品購入/,&,,/g;s/その他医療費/,,,&/g' > $output_file
