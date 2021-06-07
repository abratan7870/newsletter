require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const app = express();

app.use(express.static("public"));

app.use(bodyparser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.render("index");
});

app.set('view engine', 'ejs');

app.post("/", function(req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/0e4f92e5ed"

  const options = {
    method: "POST",
    auth: process.env.ID
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.render("success");
    } else {
        res.render("failure");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});
app.post("/failure", function(req, res) {
  res.redirect("/")
});
let port=process.env.PORT;
if(port===null || port=== ""){
  port=3000;
}
app.listen(port,function(){
  console.log("Server started ");
});

//api key
// c7aa895ef791d3f296948f121c579593-us6 we use same us present here in line no 29
//listid
//0e4f92e5ed
