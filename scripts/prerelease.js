const fs = require('fs');

const DIST_LIB_PATH = '/common/';
const README_PATH = 'README.md';

copyExtraFiles();

function copyExtraFiles() {
  if (!fs.existsSync(README_PATH)) {
    throw new Error('README do not exit');
  } else {
    copyReadmeIntoLibFolder(README_PATH, 'core');
    copyReadmeIntoLibFolder(README_PATH, 'browser');
    copyReadmeIntoLibFolder(README_PATH, 'angular');
  }
}

function copyReadmeIntoLibFolder(srcPath, lib) {
  const fileBody = fs.readFileSync(srcPath).toString();

  fs.writeFileSync(`libs/${lib}/${README_PATH}`, fileBody);
}
