var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var express = require("express");
var Model = require("./models/data");

// import env variables from variables.env file
require("dotenv").config({
  path: "variables.env",
});

// //connect to db
// mongoose.connect('mongodb://localhost:27017/searchingg',{useNewUrlParser:true})
// .then(()=>console.log('connectd to db'))
// .catch((err)=>console.log('error ',err))

// Connect to Database and handle any bad connections
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on("error", (err) => {
  console.error(`${err.message}`);
});

//init app
var app = express();

//set view engine
app.set("view engine", "ejs");

///fetch the data from request
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//default page load
app.get("/", (req, res) => {
  try {
    Model.find((err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.render("pages/home", { data: data });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//search
app.get("/search", (req, res) => {
  try {
    Model.find(
      {
        $or: [
          { naziv: { $regex: escapeRegex(req.query.dsearch).toUpperCase() } },
          { zemlja: { $regex: escapeRegex(req.query.dsearch).toUpperCase() } },
        ],
      },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.render("pages/home", { data: data });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/", (req, res) => {
  try {
    var books = new bookModel({
      author: req.body.author,
      books: req.body.book,
    });
    books.save((err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log("server run at " + port));
