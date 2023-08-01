require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path'); // Added to handle file paths

const app = express();
const port = process.env.PORT || 4000;

// Database connection
mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log("connected to database!"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: 'my secret key',
  saveUninitialized: true,
  resave: false
}));


app.use((req,res,next)=>{
  res.locals.message=req.session.message;
  delete req.session.message; 
  next();
});

app.use(express.static("uploads"));
app.use(express.static(path.join(__dirname,'public')))



// Set the views directory
app.set('views', path.join(__dirname, 'views')); // Assuming your views folder is named "views"

// Set template engine
app.set('view engine', 'ejs');

// Route prefix
app.use("", require("./routes/routes"));

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
