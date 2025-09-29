const path = require('path')
const express = require('express');
const rootDir = require('../utils/pathUtils')

const coursesRoute = express.Router();
const quizzesRoute = express.Router();
const microRoute = express.Router();
const flashcardsRoute = express.Router();
const analyzerRoute = express.Router();

// for css style (path of css file)
coursesRoute.use(express.static(path.join(rootDir, 'public')))
quizzesRoute.use(express.static(path.join(rootDir, 'public')))
microRoute.use(express.static(path.join(rootDir, 'public')))
flashcardsRoute.use(express.static(path.join(rootDir, 'public')))
analyzerRoute.use(express.static(path.join(rootDir, 'public')))

coursesRoute.get('/courses', (req, res, next) => {
  console.log('Courses Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'courses.html'))
})

quizzesRoute.get('/courses/quizzes', (req, res, next) => {
  console.log('Quizzes Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'quizzes.html'))
})

microRoute.get('/courses/micro', (req, res, next) => {
  console.log('Micro-Learning Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'micro.html'))
})

flashcardsRoute.get('/courses/flashcards', (req, res, next) => {
  console.log('Flashcards Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'flashcards.html'))
})

analyzerRoute.get('/courses/analyzer', (req, res, next) => {
  console.log('Analyzer Page get', req.url, req.method);
  res.sendFile(path.join(rootDir, 'view', 'analyzer.html'))
})


exports.quizzesRoute = quizzesRoute;
exports.flashcardsRoute = flashcardsRoute;
exports.microRoute = microRoute;
exports.coursesRoute = coursesRoute;
exports.analyzerRoute = analyzerRoute;

