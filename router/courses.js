const path = require('path')
const express = require('express');
const rootDir = require('../utils/pathUtils')

const coursesRoute = express.Router();

coursesRoute.get('/courses', (req, res, next) => {
  console.log('Courses Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'courses.html'))
})

// for css style (path of css file)
coursesRoute.use(express.static(path.join(rootDir, 'public')))

module.exports = coursesRoute;

