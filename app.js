// jshint esversion6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item" , itemsSchema);

const item1 = new Item({
    name: "welcome to your todolist!"
}) 

const defaultItems = [item1];

app.get("/", function(req , res){
    
    Item.find({}).then(function(foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems);
            res.redirect("/");
        }
        else{
            res.render("list", {ListTitle: "Today" , newlistitems: foundItems}); 
        } 
    })   
});

app.post("/", function(req, res){ 
    const itemName = req.body.new_item;  

    const item = new Item({
        name: itemName
    });

    item.save();
    res.redirect("/");

});

app.post("/delete", function(req, res){

    const checkedId = req.body.checkbox;
    Item.findByIdAndDelete(checkedId).then(function(err){ 
        if (!err){ 
            console.log("Deleted");
            res.redirect("/"); 
        } 
    })
});

app.listen(3000, function(){
    console.log("server started on port 3000");
});
