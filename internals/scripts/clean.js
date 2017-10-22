require('shelljs/global');
const addCheckMark = require('./helpers/checkmark.js');

if (!which('git')) { // eslint-disable-line
  echo('Sorry, this script requires git'); // eslint-disable-line
  exit(1); // eslint-disable-line
}

if (!test('-e', 'internals/templates')) {
  echo('The example is deleted already.'); // eslint-disable-line
  exit(1); // eslint-disable-line
}

process.stdout.write('Cleanup started...');

// Reuse existing LanguageProvider and i18n tests
mv('app/containers/LanguageProvider/tests', 'internals/templates/containers/LanguageProvider'); // eslint-disable-line
cp('app/tests/i18n.test.js', 'internals/templates/tests/i18n.test.js'); // eslint-disable-line

// Cleanup components/
rm('-rf', 'app/components/*'); // eslint-disable-line

// Handle containers/
rm('-rf', 'app/containers'); // eslint-disable-line
mv('internals/templates/containers', 'app'); // eslint-disable-line

// Handle tests/
mv('internals/templates/tests', 'app'); // eslint-disable-line

// Handle translations/
rm('-rf', 'app/translations') // eslint-disable-line
mv('internals/templates/translations', 'app'); // eslint-disable-line

// Handle utils/
rm('-rf', 'app/utils'); // eslint-disable-line
mv('internals/templates/utils', 'app') // eslint-disable-line

// Replace the files in the root app/ folder
cp('internals/templates/app.js', 'app/app.js'); // eslint-disable-line
cp('internals/templates/global-styles.js', 'app/global-styles.js'); // eslint-disable-line
cp('internals/templates/i18n.js', 'app/i18n.js'); // eslint-disable-line
cp('internals/templates/index.html', 'app/index.html'); // eslint-disable-line
cp('internals/templates/reducers.js', 'app/reducers.js'); // eslint-disable-line
cp('internals/templates/routes.js', 'app/routes.js'); // eslint-disable-line
cp('internals/templates/store.js', 'app/store.js'); // eslint-disable-line

// Remove the templates folder
rm('-rf', 'internals/templates'); // eslint-disable-line

addCheckMark();

// Commit the changes
if (exec('git add . --all && git commit -qm "Remove default example"').code !== 0) { // eslint-disable-line
  echo('\nError: Git commit failed'); // eslint-disable-line
  exit(1); // eslint-disable-line
}

echo('\nCleanup done. Happy Coding!!!'); // eslint-disable-line
