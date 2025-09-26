const path = require('path')
const express = require('express');
const rootDir = require('../utils/pathUtils')

const microRoute = express.Router();

microRoute.get('/courses/micro', (req, res, next) => {
  console.log('Micro-Learning Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'micro.html'))
})

// for css style (path of css file)
microRoute.use(express.static(path.join(rootDir, 'public')))

module.exports = microRoute;
