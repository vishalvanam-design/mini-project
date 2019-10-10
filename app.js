var express = require('express');
var mongoose = require('mongoose');
var path = require("path");
var bodyParser = require("body-parser");
var ehbs = require("express-handlebars");
var helpers = require("handlebars-helpers")();
var rolno;

//mongo stuff
var miniSchema = new mongoose.Schema({
    rollNo : {
        type : String,
        required : "Required"
    },
    Name : {
        type : String
    },
    Subjects : {
        type : Object
    },
    Sub1OC : {
        type : Object
    },
    SubjectNames : {
        type : Object
    },
    Sub2OC : {
        type : Object
    },
    Sub3OC : {
        type : Object
    },
    Sub4OC : {
        type : Object
    },
    Sub5OC : {
        type : Object
    },
    Sub6OC : {
        type : Object
    },

});

var minimodel = mongoose.model("mini",miniSchema);

mongoose.connect("mongodb://localhost:27017/pro", {useNewUrlParser : true}, (err)=>{
    if(!err){
        console.log("mongo connection successful");
    }
    else{
        console.log("Error connecting to mongo");
    }
});


//express stuff
var app = express();
app.listen("3000", ()=>{
    console.log("Server started");
});

app.use(bodyParser.urlencoded({
    extended : true
}));

app.set('views',path.join(__dirname,"/views"));

app.engine('hbs',ehbs({
    extname : "hbs",
    defaultLayout : "mainLayout",
    layoutsDir : __dirname + "/views/layouts"
}));

app.set("view engine", "hbs");

//routing
app.get("/", (req,res)=>{
    res.render("index", {});
});

app.post("/",(req,res)=>{
    rolno = req.body.rno;
    res.redirect("/list");
});

//app.get("/list", (req,res)=>{
 //   res.send();
//});

app.get("/list",(req,res)=>
{   var query = {rollNo : rolno};
    minimodel.find(query,(err, result)=>{
        if(!(result.length<1)){
            res.render("list", {data:result});
            console.log(result);
        }
        else{
            res.render("blank",{});
        }
    });
});


//helpers
ehbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2;
        },
        ne: function (v1, v2) {
            return v1 !== v2;
        },
        lt: function (v1, v2) {
            return v1 < v2;
        },
        gt: function (v1, v2) {
            return v1 > v2;
        },
        lte: function (v1, v2) {
            return v1 <= v2;
        },
        gte: function (v1, v2) {
            return v1 >= v2;
        },
        and: function () {
            return Array.prototype.slice.call(arguments).every(Boolean);
        },
        or: function () {
            return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        }
    }
  });
  