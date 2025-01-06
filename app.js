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
// console.log("This line has executed!!")
    const docs1 = await Item.insertMany([
        {task:"Eat"},
        {task:"Sleep"},
        {task:"Walk"}
    ]);
    
   
    res.redirect("/")
   

  }else{
    // console.log("to finish"+checking.length)
    res.render("list",{Date:toDay, itemLoop:insideTask, tofinish:checking.length});
  }
  
});
// Dynamic Routing Parameters 
app.get("/:customPage", async function (req,res){
    
    const requtPage = req.params.customPage;
    const customItem = await List.findOne({name:_.lowerCase(requtPage)});
    if(!customItem){
        switch(requtPage){
            case "exercise":
                const newList1 = new List({
                    name:_.lowerCase(requtPage),
                    customTask:[{task:"Eat a light snack"},
                        {task:"Warm up or stretch"}]
                });
                await newList1.save();
                // console.log("List created!!")
                res.redirect("/"+_.lowerCase(requtPage));
                break;

            case "work":
                const newList2 = new List({
                    name:_.lowerCase(requtPage),
                    customTask:[{task:"Eat a healthy breakfast"},
                        {task:"Pack your work essentials"}]
                });
                await newList2.save();
               // console.log("List created!!")
                res.redirect("/"+_.lowerCase(requtPage));
                break;

                default:
                    const newList3 = new List({
                        name:_.lowerCase(requtPage),
                        customTask:[{task:"Eat"},
                            {task:"Sleep"},
                            {task:"walk"}]
                    });
                    await newList3.save();
                    // console.log("List created!!")
                    res.redirect("/"+_.lowerCase(requtPage));

        }
       

    }else{

        const taskCount = customItem.customTask.length;
        res.render("list",{Date:_.capitalize(requtPage), itemLoop:customItem.customTask, tofinish:taskCount});
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
       const xxx = await List.findOne({name:_.lowerCase(req.body.checkboxList)});
    //    console.log(xxx.customTask.length)

       if(xxx.customTask.length===0){
        await List.findOneAndDelete({name:_.lowerCase(req.body.checkboxList)});
       }
    //    if(await List.findOne({name:_.lowerCase(req.body.checkboxList)}).customTask.length===0){
    //     await List.findByIdAndDelete({name:_.lowerCase(req.body.checkboxList)});
    //    }
        res.redirect("/"+_.lowerCase(req.body.checkboxList))
    }
   
})




app.listen(4000, function(){
    console.log("Server is running on port 4000.");
    
})