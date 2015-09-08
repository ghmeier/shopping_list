var express = require("express");
var Firebase = require("firebase");
var fb_root = new Firebase("http://chillpad-shopping.firebaseio.com");
var app = express();

app.set("port",(process.env.PORT || 5000));

app.get("/ping",function(req,res){
	res.send("pong");
});

app.get("/",function(req,res){
	res.json({message:null});
});

app.get("/list",function(req,res){
	var list = fb_root.child("list");

	list.once("value",function(snap){
		res.json(snap.val());
	},function(err){
		res.json({message:"Error retrieving list.",err:err});
	});
});

var server = app.listen(app.get("port"),function(){
	console.log("Running Chillpad Shopping on port "+app.get("port"));
});
