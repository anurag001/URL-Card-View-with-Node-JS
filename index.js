var express = require("express");
var cookieParser = require('cookie-parser');
var http = require ('http');
var mongoose = require ("mongoose");
var app = express();
var modelObj = require('./models')(mongoose);
var jsdom = require('jsdom')
var request = require('request')

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var url = "mongodb://localhost:27017/scrap";
mongoose.connect(url);


//Index
app.get('/', function(req, res) {
	
	res.render("index");

});


app.get("/search/:category/:subcategory",function(req,res){
	
	var category = req.param("category");
	var subCategory = req.param("subcategory");
	var searchArray = subCategory.split(" ");		
    
    modelObj.Records.find({$and:[{subcategory:{"$in":searchArray}},{category:category}]}).exec(function(Err,Resp){
            
        if (Err) throw Err;
        
	    var urls = Resp.map(function(urlResp) { 
	    	return urlResp.url; 
	    });
		
		res.send(urls);	
    });

});

app.post("/explore",function(req,res){
	
		var address = req.body.address;
		
		var image="";
		var title="";
		var description="";
		console.log(address);
		
		if(address!=undefined)
		{
	    	request({uri:address}, function(err, response, body){
		
				//Just a basic error check
				if(err && response.statusCode !== 200){console.log('Request error.');}
				
				if(body!=undefined)
				{
					image = body.substring(body.search('meta property="og:image" content="')+34,body.indexOf("\"",body.search('meta property="og:image" content="')+34));
					title = body.substring(body.search('meta property="og:title" content="')+34,body.indexOf("\"",body.search('meta property="og:title" content="')+34));
					description = body.substring(body.search('meta property="og:description" content="')+40,body.indexOf("\"",body.search('meta property="og:description" content="')+40));
					if(image==undefined || image=="")
					{
						image="Image Not Found";
					}
					if(title==undefined || title=="")
					{
						title="Title";
					}

					if(description==undefined || description=="")
					{
						description="Description";
					}
				}

				res.render('card-list',{
					url:address,
					image:image,
					title:title,
					description:description
				}); 

	        });
    	}
		    		
});

var server = app.listen(8000,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("App is running");
});
