var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


router.get("/", function(req,res){
   //get all campground from DB
   
   Campground.find({}, function(err,allCampgrounds){
       if(err){
           console.log(err);
       }else{
          res.render("campgrounds/index", {campgrounds:allCampgrounds});
           
       }
   });
 
});

router.post("/", middleware.isLoggedIn, function(req,res){
    
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username:req.user.username
   };
   var newCampgound = {name: name, price: price, image: image, description:desc, author: author};
   
  //Create a new campground and save to DB
    Campground.create(newCampgound, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
             console.log(newlyCreated);
             res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//show more info about one campground
router.get("/:id", function(req, res) {
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership,  function(req, res) {
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else{
        res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
        
});


//Update Campground Route

router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    
    // find and update the correct campground
   
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" +req.params.id);
        }
    });
    
    //redirect somewhere
    
    
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports =router;