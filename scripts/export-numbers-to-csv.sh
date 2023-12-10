#!/usr/bin/osascript

on run argv
    
    set theFilePath to POSIX file (item 1 of argv)
    set theNumbersFileFolder to theFilePath as alias
    set theCsvFolder to POSIX file "/Users/my.name" # Enter the path to your home folder
    tell application "System Events" to set theNumbersFileIterator to theNumbersFileFolder's items whose name extension = "numbers"
    
    repeat with aNumbersFile in theNumbersFileIterator
        set docName to aNumbersFile's name as text
            set exportName to (theCsvFolder as text) & docName
            set exportName to exportName's text 1 thru -8
            set exportName to (exportName & "csv") -- append .csv to directory name
            tell application "Numbers"
                launch
                open aNumbersFile
                delay 3 -- may need to adjust this higher 
                export front document to file exportName as CSV
            end tell
    end repeat
    
end run