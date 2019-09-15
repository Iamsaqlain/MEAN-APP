const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images",express.static(path.join("backend/images")));


mongoose.connect("mongodb+srv://iamsaqlain:HtOZo4NSlhSc5lZK@cluster0-zm2xm.mongodb.net/min-network?retryWrites=true&w=majority")
  .then(() =>{
    console.log('Connected to database!')
  })
  .catch((error) =>{
    console.log(error);
    console.log('Connection Failed');
});

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,PUT,OPTIONS"
  );
  next();
});

app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
