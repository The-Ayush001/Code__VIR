const path = require('path')
const express = require('express');
const rootDir = require('../utils/pathUtils')

const progressRoute = express.Router();

progressRoute.get('/progress', (req, res, next) => {
  console.log('Progress Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'progress.html'))
})

// for css style (path of css file)
progressRoute.use(express.static(path.join(rootDir, 'public')))

module.exports = progressRoute;
