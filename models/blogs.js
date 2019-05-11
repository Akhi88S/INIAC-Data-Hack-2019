var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var blogSchema = new mongoose.Schema({

	title: String,
	image: String, //{ type: String, default: placeholder.jpg }
	body: String,
		created: { type: Date, default: Date.now },
		author: [{
	     id: {
	       type: mongoose.Schema.Types.ObjectId,
	       ref: "User"
	     },
	    //  username: String,
}]
});
module.exports = mongoose.model("Blog",blogSchema);
