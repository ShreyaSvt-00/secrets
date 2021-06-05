//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");



const app=express();



app.use(express.static("public"));
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://localhost:27017/userdb",{useNewUrlParser:true});


const userschema=new mongoose.Schema({
  email:String,
  password:String
});


userschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userschema);



app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/",function(req,res){
  res.render("home");
});

app.get("/logout",function(req,res){
  res.render("home");
})


app.post("/register",function(req,res){
  const newuser=new User({
    email:req.body.username,
    password:req.body.password

  })
  newuser.save(function(err){ ///whenever you use save() the password gets encrytped automatically
    if(!err)
    {
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  })
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const pwd=req.body.password;
User.findOne({email:username},function(err,founduser){  ////andwhenever we use findone() mongoose-encrypt decrypts the Password

  if(err){
    console.log(err);
  }
  else{
    if(founduser){
      if(founduser.password===pwd){
        res.render("secrets");
      }
    }

  }
})

});







app.listen(3000,function(){
  console.log("Server started on port 3000");
})
