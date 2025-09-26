const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // not required in latest express but works
app.use(express.static('public'));


app.use(bodyParser.urlencoded()); // to parse form data

const homeRoute = require('./router/Home');
const coursesRouter = require('./router/courses');
const quizzesRouter = require('./router/quizzes');
const microRouter = require('./router/micro');
const flashcardsRouter = require('./router/flashcards');
const analyzeRouter = require('./router/analyzer');


const progressRoute = require('./router/progress');
const reminderRoute = require('./router/Reminder');

const signRoute = require('./router/sign_up');


app.use(homeRoute);
app.get("/test", (req, res)=>{
  res.send("Express is working!")
})
app.use(coursesRouter);
app.use(progressRoute);
app.use(reminderRoute);

app.use(quizzesRouter);
app.use(microRouter);
app.use(flashcardsRouter);
app.use(analyzeRouter);
app.use(signRoute);

const PORT = 8000;
app.listen(PORT,()=>{
  console.log(`Server is started on address http://localhost:${PORT}`)
})



