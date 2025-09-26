const path = require('path')
const express = require('express');
const rootDir = require('../utils/pathUtils')

const reminderRoute = express.Router();

reminderRoute.get('/reminder', (req, res, next) => {
  console.log('Reminder Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'reminder.html'))
})

// for css style (path of css file)
reminderRoute.use(express.static(path.join(rootDir, 'public')))

module.exports = reminderRoute;
