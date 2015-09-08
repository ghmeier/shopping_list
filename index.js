var express = require("express");
var Firebase = require("firebase");
var fb_root = new Firebase("http://chillpad-shopping.firebaseio.com");
var app = express();

getRes = function(message,data){
	return {message:message,data:data};
}

app.set("port",(process.env.PORT || 5000));

app.get("/ping",function(req,res){
	res.send("pong");
});

app.get("/",function(req,res){
	res.json(getRes("Hi!",null));
});

app.get("/list",function(req,res){
	var list = fb_root.child("list");

	list.once("value",function(snap){
		res.json(getRes("success",snap.val()));
	},function(err){
		res.json(getRes("Error retrieving list.",err));
	});
});

app.get("/get",function(req,res){
	var list = fb_root.child("list");
	var rawData = req.query.items;
	var items = rawData.split(",");

	list.once("value",function(snap){
		var data = snap.val();

		if (!data){
			data = [];
		}

		var latest = data.concat(items);
		list.set(latest,function(error){
			if (error){
				res.json(getRes("Error updating list",error));
			}else{
				res.json(getRes("success",latest));
			}
		});
	},function(err){
		res.json(getRes("Error adding "+items,err));
	});
});

app.get("/buy",function(req,res){
	var list = fb_root.child("list");
	var rawData = req.query.items;
	var items = [];
	if (rawData){
		rawData.split(",");
	}
	
	list.once("value",function(snap){
		var latest = [];
		var data = snap.val();

		if (items.length > 0){
			for (id in data){
				for (i in items){
					if (items[i] === data[id]){
						latest.push(items[i]);
						data.splice(id,1);
					}
				}
			}			
		}else{
			latest = data.concat(latest);
			data = [];
		}

		var date = ((new Date().toDateString())+(new Date().toTimeString())).replace(/\s+/g,"");
		var bought = fb_root.child("bought-"+date);

		list.set(data,function(error){
			if (error){
				res.json(getRes("Error updating list",error));
			}else{
				bought.set(latest,function(b_error){
					if (b_error){
						res.json(getRes("Error updating bought list.",error));
					}else{
						res.json(getRes("success",{bought:latest,list:data}));
					}
				});
			}
		});

	},function(err){
		res.json(getRes("Error retrieving list.",err));
	});
});

var server = app.listen(app.get("port"),function(){
	console.log("Running Chillpad Shopping on port "+app.get("port"));

	var list = fb_root.child("list");

	list.on("value",function(snap){
		console.log(snap.val());
	});
});
