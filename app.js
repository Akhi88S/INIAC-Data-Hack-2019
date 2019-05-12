var express 	= require('express'),
	app 		= express(),
	bodyParser 	= require('body-parser'),
	mongoose 	= require('mongoose'),
	passport              = require("passport"),
	methodOverride = require('method-override'),
	 User           = require("./models/user"),
	 Blog           = require("./models/blogs"),
	expressSanitizer = require("express-sanitizer");
	localStrategy         = require("passport-local"),
	 flash          = require("connect-flash"),
  passportLocalMongoose = require("passport-local-mongoose")


//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); //has to be after bodyparser
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//MONGOOSE / MODEL CONFIG
 //  var blogSchema = new mongoose.Schema({
 	//  title: String,
 	//  image: String, //{ type: String, default: placeholder.jpg }
	//  body: String,
	// 	created: { type: Date, default: Date.now } //default value for date
// });

// var Blog = mongoose.model("Blog", blogSchema);



// pass currentUser to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is an authenticated user
//  res.locals.error = req.flash("error");
//  res.locals.success = req.flash("success");
  next();
});

//--------RESTful ROUTES--------//




app.get("/", function(req, res){
	res.render("home");
})






//         app.get("/secret",isLoggedIn, function(req, res){
//         res.render("secret");
//         });

// Auth Routes

//show sign up form
app.get("/register", function(req, res){
   res.render("register");
});
//handling user sign up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/blogs");
        });
    });
});

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("home");
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
	});


	app.get("/User/:id/blogs", function(req, res){
		Blog.find({}, function(err, blogs){
			if(err){
				console.log(err);
			} else{
				res.render("index", {blogs: blogs});
			}
		});
	});



	//INDEX ROUTE  //    ).populate('user').exec
	//INDEX ROUTE
	app.get("/blogs", function(req, res){
		Blog.find({}, function(err, blogs){
			if(err){
				console.log(err);
			} else{
				res.render("index", {blogs: blogs});
			}
		});
	});
//NEW ROUTE
app.get("/blogs/new",isLoggedIn,function(req, res){
	res.render("new");
});
app.get("/blogs/userprof",isLoggedIn,function(req, res){
		res.render("userprof");
});

//CREATE ROUTE
app.post("/blogs",isLoggedIn,function(req, res){
	//create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {



			//redirect to index
		//	var user = req.User;
	// Blog.Users.push(user);
//save the updated user
	// user.save((error, user) => {
	//	 if(error) {
			 //handle error
//		 } else {
			//you have saved the user with resume ref now.
			 res.redirect("/blogs") ;
		}
	});
});


//SHOW ROUTE
app.get("/blogs/:id",isLoggedIn,function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/");
		} else {
			res.render("show", {blog: foundBlog, currentUser: req.user});
		}
	});
});
//EDIT ROUTE
app.get("/blogs/:id/edit",isLoggedIn,function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id",isLoggedIn,function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	})//id, newdata, callback
});

//DELETE ROUTE
app.delete("/blogs/:id",isLoggedIn,function(req, res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	})
	//redirect somewhere
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
console.log("Listening on Port 3000");
});
