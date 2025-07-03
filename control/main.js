const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const moment = require('moment');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

hbs.registerHelper('inc', value => parseInt(value) + 1);
hbs.registerHelper('substring', (str, start, end) => typeof str === 'string' ? str.substring(start, end) : '');
hbs.registerHelper('eq', (a, b) => a === b);
hbs.registerHelper('formatDate', (date, format) => (!date ? '' : moment(date).format(format)));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../view'));
app.use(express.static(path.join(__dirname, '../view/public')));
app.use(express.static(path.join(__dirname, '../model/Files')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: true
}));


const collection = require('../model/Users');


app.get('/Login', (req, res) => {
  res.render('LoginView');
});
app.post('/login', async (req, res) => {
  try {
    const check = await collection.findOne({ username: req.body.username, password: req.body.password });
    if (check.username === 'admin' && check.password === '123') {
      return res.redirect('/Admin');
    } else if (check.password === req.body.password) {
      req.session.username = check.username;
      res.redirect('/Home');
    } else {
      res.send('<h1>Invalid username or password</h1><p>Please try again.</p><a href="/Login">Go back to Login</a>');
    }
  } catch {
      res.send('<h1>Invalid username or password</h1><p>Please try again.</p><a href="/Login">Go back to Login</a>');

  }
});

app.get('/register', (req, res) => {
  res.render('RegisterView');
});
app.post('/register', async (req, res) => {
  try {
    const existingUser = await collection.findOne({ username: req.body.username });
    if (existingUser) {
      return res.send(`
        <h1>Registration Failed</h1>
        <p>The username <strong>${req.body.username}</strong> is already taken. Please choose a different username.</p>
        <a href="/register">Go back to Register</a>
      `);
    }
    await collection.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
    });
    res.redirect('/Login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('An error occurred during registration.');
  }
});


const CategoryController = require('./CategoryController');
const FileController = require('./FileController');
const PostController = require('./PostController');
const ReplysController = require('./ReplysController');
const UserController = require('./UserController');
const SearchController = require('./SearchController');
const EditUploadsController = require('./EditUploadsController'); 


app.use(CategoryController);
app.use(FileController);
app.use(PostController);
app.use(ReplysController);
app.use(UserController);
app.use(SearchController);
app.use(EditUploadsController); 



app.get('/Home', (req, res) => {
  
  res.render('HomeView', { username: req.session.username });
});

app.get('/Admin', (req, res) => {
  res.render('AdminView');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log('Server is running on port ' + port);
  });
}
mongoose.connect('mongodb://localhost:27017/ermad')
.then(() => {  console.log("Connected to MongoDB");})
.catch((error) => { console.error("Error connecting to MongoDB:", error); });

module.exports = app;