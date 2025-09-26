const path = require('path')
const express = require('express');
const rootDir = require('../utils/pathUtils')

const homeRoute = express.Router();
homeRoute.use(express.static('public'));

homeRoute.get('/', (req, res, next) => {
  console.log('Home Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'index.html'))
})

// for css style (path of css file)

homeRoute.use(express.static(path.join(rootDir, 'public')))

module.exports = homeRoute;
