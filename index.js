const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // not required in latest express but works
app.use(express.static('public'));


app.use(bodyParser.urlencoded()); // to parse form data

const homeRoute = require('./router/Home');

const { coursesRoute } = require('./router/courses');  // Importing the coursesRoute
const { quizzesRoute } = require('./router/courses');  // Importing the quizzesRoute
const { microRoute } = require('./router/courses');  // Importing the microRoute
const { flashcardsRoute } = require('./router/courses');  // Importing the flashcardsRoute
const { analyzerRoute} = require('./router/courses')  // Importing the analyzerRoute

const coursesRouter = coursesRoute;  // Renaming for clarity
const quizzesRouter = quizzesRoute;  // Renaming for clarity
const microRouter = microRoute;  // Renaming for clarity
const flashcardsRouter = flashcardsRoute;  // Renaming for clarity
const analyzerRouter = analyzerRoute; // Renaming for clarity


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
app.use(analyzerRouter);
app.use(signRoute);

const PORT = 8000;
app.listen(PORT,()=>{
  console.log(`Server is started on address http://localhost:${PORT}`)
})



