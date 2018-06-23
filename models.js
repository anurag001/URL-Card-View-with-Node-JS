var mongoose = require ("mongoose");
var url = "mongodb://localhost:27017/scrap";
mongoose.connect(url);
var Schema = mongoose.Schema;

module.exports = function(mongoose) {
	var recordSchema = new Schema({
		url:{type:String, required:true},
		category:{type:String, required:true},
		subcategory:{type:[String], required:true}	
	});
	


	var models = {
		Records:mongoose.model('records',recordSchema),
	};
	return models;



}
