
let express = require("express");
let app = express();

let mongodb = require("mongodb");
let MongoClient = mongodb.MongoClient;

let db = null;
let dbString = 'mongodb+srv://appUser:Maddy@123@cluster0.zaevidj.mongodb.net/myApp?retryWrites=true&w=majority';
let dbName = 'myApp';
let port= process.env.PORT;

if(port == null || port=="")
{
    port=3000;
}

MongoClient.connect(dbString, {useNewUrlParser:true, useUnifiedTopology:true}, function(err,client){
    if(err)
    {
        throw err
    }
    db = client.db(dbName);
    app.listen(port);
});

app.use(express.json());
app.use(express.static('Public'));
app.use(express.urlencoded({extended:false}));

function passProcted(req,res,next){
res.set("WWW-Authenticate","Basic realm='SimpleApp'")
if(req.headers.authorization == "Basic aWQ6cGFzc3dvcmQ=")
{
    next();
}
else
{
    res.status(401).send("Please provide Correct Id and Password");
}
}

app.use(passProcted);

app.get('/',function(req,res){
    db.collection('items').find().toArray(function(err,items){
        /* console.log(items); */

        res.send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>To Do List</title>
            
                <style>
            
                    h1{
                        margin-left: -7rem;
                    }
            
                    div.container{
                        width: 55rem;
                    }
            
                    div.input-group{
                        width: 40rem;
                        margin: 2rem 1rem 2rem 4rem; /* Updated margin values */
                        background-color: #0e233833; /* Added background color */
                        padding: 10px; /* Added padding for better appearance */
                        border-radius: 5px; /* Added border-radius for rounded corners */
                    }
            
                    div>button{
                        margin-right: 1rem;
                    }
            
                    ul.list-group{
                        margin-top: 3rem;
                    }
            
                    li.list-group-item{
                        width: 26rem;
                        margin-left: 10rem;
                        margin-bottom: 1rem;
                        border: 1px solid black;
                        border-radius: 10px
                    }
                    
                </style>
                <!-- Add Bootstrap CSS link here -->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container mt-5">
                    <h1 class="text-center">To-Do List</h1>
                
                    <form class="mt-3" action="/create-item" method="POST">
                
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" name="item" autocomplete="off" placeholder="Add new task">
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="submit">Submit</button>
                            </div>
                        </div>
                
                        <ul class="list-group">
                            ${items.map(function(item){
                                return `<li class="list-group-item d-flex justify-content-between align-items-center ">
                                   <span class="item-text">${item.text}</span>
                                    <div>
                                        <button data-id=${item._id} class="btn btn-warning">Edit</button>
                                        <button data-id=${item._id} class="btn btn-danger">Delete</button>
                                    </div>
                                </li>` 
                            }).join('')}
                        </ul>
                
                    </form>
                </div>
                
                <script src='/browser.js'> </script>

                <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

                <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            </body>
        </html>
        `);
    });
})

app.post('/create-item',function(req,res){
    db.collection('items').insertOne({text: req.body.item}, function(){
        res.redirect('/');
    });
    console.log(req.body.item);
})

app.post('/update-item',function(req,res){
    db.collection('items').findOneAndUpdate({_id:new mongodb.ObjectId(req.body.id)},{$set:{text:req.body.text}},function(){
        res.send("Data updated");
    });
})

app.post('/delete-item',function(req,res){
    db.collection('items').deleteOne({_id:new mongodb.ObjectId(req.body.id)},function(){
        res.send("Data Removed Successfully!");
    })
})

