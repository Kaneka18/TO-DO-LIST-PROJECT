// const list = require("./list.model");
// const mongoose =require("mongoose");

// mongoose.connect("mongodb://localhost/toDoListDatabase");

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, "Error while connecting to MongoDB"));

// db.once('open', function(){
//     console.log("Successfully connected to database");
// });

//     if(!error){
//         console.log("Success connect !!!");
//     }
//     else{
//         console.log("Error connecting to databse.");
//     }
// });

// module.exports=db;

const mongoose = require("mongoose");
const mongoDbURL = "mongodb://localhost:27017/toDoListDatabase";

mongoose.connect(mongoDbURL, (err) => {
    if(err){
        console.log(err.message);
    }
    else{
        console.log("Succussfully connected to Database !!!");
    }
});

const listModel = require("./list.model");