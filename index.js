var express = require("express");
var app = express();

app.set("port",(process.env.PORT || 5000));

app.get("/ping",function(req,res){
	res.send("pong");
});

var server = app.listen(app.get("port"),function(){
	console.log("Running Chillpad Shopping on port "+app.get("port"));
});
