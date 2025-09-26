const path = require('path')
const express = require('express');
const rootDir = require('../utils/pathUtils')

const analyzerRoute = express.Router();

analyzerRoute.get('/courses/analyzer', (req, res, next) => {
  console.log('Analyzer Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'analyzer.html'))
})

// for css style (path of css file)
analyzerRoute.use(express.static(path.join(rootDir, 'public')))

module.exports = analyzerRoute;
