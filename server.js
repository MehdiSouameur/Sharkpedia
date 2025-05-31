const express = require("express");
const cookieParser = require('cookie-parser');
const routes = require("./config.js");
const indexRouter = require('./routes/index');
const removeTrailingSlash = require('./middleware/trailingSlash'); 
const app = express();
const PORT = process.env.PORT || 3000;  // Use Heroku's port, fallback to 3000 locally
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

require('dotenv').config();


app.set("view engine", "ejs");
app.use(express.static("public"));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
const fileUpload = require("express-fileupload");
app.use(fileUpload())
app.use(removeTrailingSlash);
app.use(cookieParser());


app.use(routes.home, indexRouter);
app.use(routes.article, indexRouter);
app.use(routes.createEntry, indexRouter);
app.use(routes.gallery, indexRouter);
app.use(routes.pageNotFound, indexRouter);
app.use(routes.firebasePost, indexRouter);
app.use(routes.firebaseEdit, indexRouter);
app.use(routes.firebaseDelete, indexRouter);
app.use(routes.pageNotFound, indexRouter);
app.use(routes.adminPage, indexRouter);
app.use(routes.authenticate, indexRouter);
app.use(routes.edit, indexRouter);

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
})