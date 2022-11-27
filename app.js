const express = require('express');
const bodyParser = require("body-parser");
const app = express();
var ejs = require('ejs');;
const host = 3000;
const morgan = require('morgan')
const mongoose = require('mongoose');


 

/////////////

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
mongoose.connect("mongodb://localhost:27017/todolistDB");
const db = mongoose.connection;

///////verification de connection la base de donnne ///

db.on('error', (err)=>{
    console.log(err)
});
db.once('open',()=>{
    console.log("connection a la base de donnee ok");
})


////////////////// mes tables dans la base de  donnees ////////////////////////// 
    const itemsSchema =  {
        name: String
    }
///////////////// model de la table de reference ////////////////////////////////
    const Item = mongoose.model("Item", itemsSchema );

/////////////////////// Insertion de quelques donnes  /////////////////////////////

    const item1 = new Item ({
        name: "Esport"
    });

    const item2 = new Item ({
        name: "Gaming"
    });

    const item3 = new Item ({
        name: "Streaming"
    });

    const defaultItems = [item1, item2, item3];

    const listSchema = {
        name: String,
        items: [itemsSchema]
    }
    const List = mongoose.model('List', listSchema)


    // Item.insertMany(defaultItems, (err)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log("ajout avec succes")
    //     }
    // });


//////////////////////////////////////////////////////////////////////////////

app.get('/', (req,res)=>{

   
    Item.find({}, (err, foitems)=>{
        if(err){
            console.log(err);
        }else{
            if(foitems.lenght === 0){
            
                    Item.insertMany(defaultItems, (err)=>{
                        if(err){
                            console.log(err);
                        }else{
                            console.log("ajout avec succes")
                        }
                    });
                    res.redirect('/')

            }else{

                res.render("list", {listTitle: "Today", newListItems: foitems})
            } 
        }
    });
   
   
    
    
})

////////////////

app.post('/', (req, res)=> {

    const itemName = req.body.newItem ;

    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

app.post('/delete', (req, res)=> {
    let id = req.body.checkbox
    Item.findByIdAndRemove(id)
    .then(()=>{
        res.redirect('/')
    })
    .catch((err)=>{
        res.json({
            err
        })
    })
});

app.post('/update', (req, res)=>{
    let id  = req.body.upd
    let nouItem = {
        name: req.body.itemName
    }
    Item.findByIdAndUpdate(id,{$set: nouItem})
    .then(()=>{
        res.json({
            message: 'Item Modifier avec succes'
        })
    })
    .catch((err)=>{
        res.json({
            err
        })
    })
})




///////////////

app.get("/:customeName",(req,res)=>{
    const custome  = req.params.customeName ;


        const list = new List({
            name: custome,
            items: defaultItems
        });
        list.save();
    
    
    List.findOne({name:custome}, (err, found)=>{
        if(!err){
            if(!found){
                const list = new List({
                    name: custome,
                    items: defaultItems
                });
                list.save();
                res.redirect('/' + custome);
            }else{
                res.render("list", {listTitle: found.name, newListItems: found.items});
            }
        }
    });

})



app.post('/work', (req, res)=> {
    
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

/////////////////

app.get('/about', (req,res)=>{
    res.render("about");
})

//////////////////

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, ()=>{
    console.log(`server ok sur le port ${port}` );
})

