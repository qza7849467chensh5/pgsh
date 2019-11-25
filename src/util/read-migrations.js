const fs = require('fs');
const path = require('path');

const MIGRATION_FILENAME_REGEX = new RegExp(
  '(0*)(\\d+)[_].+',
  'i',
);

module.exports = (migrationsPath) => {
  if (!fs.existsSync(migrationsPath)
    || !fs.lstatSync(migrationsPath).isDirectory()) {
    return [];
  }

  return fs.readdirSync(migrationsPath).map((filename) => {
    const match = MIGRATION_FILENAME_REGEX.exec(filename);
    if (!match) {
      return console.warn(`Skipping non-migration ${filename}`);
    }
    const [_full, zeroes, textualNumber] = match; // eslint-disable-line no-unused-vars
    return {
      id: +textualNumber,
      name: filename,
      prefix: `${zeroes}${textualNumber}`,
      fullPath: path.join(migrationsPath, filename),
    };
  });
};
