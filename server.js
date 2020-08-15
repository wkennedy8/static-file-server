const express = require('express'),
  path = require('path'),
  app = express(),
  fs = require('fs');

function getFilesFromDir(dir, fileTypes) {
  var filesToReturn = [];
  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);
      if (
        fs.statSync(curFile).isFile() &&
        fileTypes.indexOf(path.extname(curFile)) != -1
      ) {
        filesToReturn.push(curFile.replace(dir, ''));
      } else if (fs.statSync(curFile).isDirectory()) {
        walkDir(curFile);
      }
    }
  }
  walkDir(dir);
  return filesToReturn;
}

const array = getFilesFromDir('./', [
  '.epub',
  '.mobi',
  '.jpg',
  '.png',
  '.gif',
  '.pdf',
  '.css',
  '.json'
]);

app.get('/links', async (req, res) => {
  try {
    res.json(array);
  } catch (e) {
    res.json({ error: e.toString() });
  }
});

app.use(express.static('static'));

module.exports = app;
