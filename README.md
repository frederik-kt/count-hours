# Manual Execution

- Run `npm install`.
- Install typescript using `npm install -g typescript`.
- Export the content from `hours.numbers` as CSV into `~/hours.csv`. You can either do this manually each time or use the script provided (see Script Setup below).
- Run this script using `npm run start` (or use the Script Setup below).

# Script Setup

- (Optional) Copy the two script files `scripts/count-hours.sh` and `scripts/export-numbers-to-csv.sh` as well as `hours.numbers` to your preferred location.
- Adapt the paths in the two script files.
- Add the following line to `~/.zshrc`, again adapting the path:
  `alias count-hours='~/path/to/count-hours.sh'`.
- `source ~/.zshrc` (or just close and reopen the terminal).
- (If you get a permission error on execution) Make the two script files executable: https://support.apple.com/guide/terminal/make-a-file-executable-apdd100908f-06b3-4e63-8a87-32e71241bab4/mac

# Usage

- Enter your data into `hours.numbers`.
- Run `count-hours` in your terminal.
