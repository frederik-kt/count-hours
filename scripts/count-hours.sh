#!/bin/bash

# Export to CSV
osascript /Users/my.user/path/to/export-numbers-to-csv.sh /Users/my.user/path/to/folder/containing/hours.numbers # Adapt the two paths. NOTE: The second path leads to the folder that contains the 'hour.numbers' file, NOT the file itself.

# Run script to output table
cd /Users/my.user/path/to/repository/count-hours # Adapt the path.
tsc
node ./dist/index.js