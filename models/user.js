var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({

  username: { type: String, unique: true, required: true },
    password: String,

       Blog1id:[ {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
       },
]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
