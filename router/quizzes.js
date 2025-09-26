const path = require('path')
const express = require('express');
const rootDir = require('../utils/pathUtils') 

const quizzesRoute = express.Router(); 

quizzesRoute.get('/courses/quizzes',(req,res,next) =>{
  console.log('Quizzes Page get',req.url,req.method);
  res.sendFile(path.join(rootDir,'view','quizzes.html'))
})

// for css style (path of css file)
quizzesRoute.use(express.static(path.join(rootDir,'public')))

module.exports = quizzesRoute;
