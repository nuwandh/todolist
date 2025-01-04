const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended : true}));
mongoose.connect("mongodb+srv://nuwan:a1jIcuQhGhqzgGXh@cluster0.lgjb6.mongodb.net/challengDB");
app.use(express.static("Public"));


const date = new Date();
let options = {weekday:'long', month:'long', day:'numeric'}
const toDay=date.toLocaleDateString("en-US", options);

const itemSchema =({
    task:String
});

// List Schema

const listSchema = ({
    name:String,
    customTask:[itemSchema],
    
    
});
// create New model fot Item
const Item = mongoose.model("Item",itemSchema );

// create use Custom Task list

const List = mongoose.model("List", listSchema);


// Home Ruting
app.get("/",async function(req, res){
    
    const insideTask = await Item.find({});
    // Check the DB ware empty or Note.

    const checking = await Item.find({});
  if(checking.length ===0){
console.log("This line has executed!!")
    const docs1 = await Item.insertMany([
        {task:"Get Up!"},
        {task:"Brush Teeth"},
        {task:"Bathing"}
    ]);
    
   
    res.redirect("/")
   

  }else{

    res.render("list",{Date:toDay, itemLoop:insideTask});
  }
  
});
// Dynamic Routing Parameters 
app.get("/:customPage", async function (req,res){
    
    const requtPage = req.params.customPage;
    const customItem = await List.findOne({name:_.lowerCase(requtPage)});
    if(!customItem){
        const newList = new List({
            name:_.lowerCase(requtPage),
            customTask:[{task:"Get Up!"},
                {task:"Brush Teeth"},
                {task:"Bathing"}]
        });
        await newList.save();
        console.log("List created!!")
        res.redirect("/"+_.lowerCase(requtPage));

    }else{


        res.render("list",{Date:_.capitalize(requtPage), itemLoop:customItem.customTask});
    }

       
       

      

   
})


// Home roting post method make Add to new Task

app.post("/", async function(req, res){
    
    const newItem = req.body.newTask;
    const whichList = req.body.findTheList;

    if(whichList==toDay){
        await Item.create({task:newItem})
    
        res.redirect("/");
    }else{
        
        await List.updateOne(
            {name:_.lowerCase(whichList)},
            {$push:{customTask:{task:newItem}}},
            
        );
        res.redirect("/"+_.lowerCase(whichList))

    }

   
});

// delete rout

app.post("/delete", async function(req,res){
   
    
    if(req.body.checkboxList===toDay){

        await Item.findOneAndDelete({task:req.body.delete})
        res.redirect("/")
    }else{

       await List.findOneAndUpdate(
        {name:_.lowerCase(req.body.checkboxList)},
        {$pull:{customTask:{task:req.body.delete}}}

       )
        res.redirect("/"+_.lowerCase(req.body.checkboxList))
    }
   
})




app.listen(4000, function(){
    console.log("Server is running on port 4000.");
    
})