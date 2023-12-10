#!/bin/bash

# Export to CSV
osascript /Users/your.name/path/to/export-numbers-to-csv.sh /Users/your.name/path/to/hours.numbers/folder # Adapt the two paths. NOTE: The second path leads to the folder that contains the 'hours.numbers' file, NOT the file itself.

# Run script to output table
cd /Users/your.name/path/to/repository/count-hours # Adapt the path.
tsc
node ./dist/index.js