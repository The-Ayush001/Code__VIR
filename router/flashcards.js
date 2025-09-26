const path = require('path')
const express = require('express');
const rootDir = require('../utils/pathUtils') 

const flashcardsRoute = express.Router(); 

flashcardsRoute.get('/courses/flashcards',(req,res,next) =>{
  console.log('Flashcards Page get',req.url,req.method);
  res.sendFile(path.join(rootDir,'view','flashcards.html'))
})

// for css style (path of css file)
flashcardsRoute.use(express.static(path.join(rootDir,'public')))

module.exports = flashcardsRoute;
