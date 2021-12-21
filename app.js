const connection = require("./model/index");
const express = require('express');
const app = express();
// const fs = require('fs'); //read/ write file fs
// const path = require('path');
// const bodyParser = require('body-parser');
// const { Router } = require("express");
// const router = express.Router();
const mongoose = require('mongoose');
const { request } = require("express");
const listModel = mongoose.model("lists");
const port = 3000;

//configure express app
// const urlencodedParser = bodyParser.urlencoded({extended:false})
// app.use(bodyParser.urlencoded({
//     extended : true
// }));

// app.use(express.urlencoded());

// app.use(bodyParser.urlencoded());

// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({
//   extended: true
// }));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//set view
app.set('views', 'public/views')
app.set('view engine', 'ejs')

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'views'))
app.use('/js', express.static(__dirname + 'views'))

/**
 * gets ui -returns home page 
 */
// app.get('/', function(req, res) {
//     // res.send("<h1>Hello World</h1>")
//     // console.log(docs);
//     // res.render("view")
//     res.render('view', { text: "hi ejs", dev: "hello client" });
// })

// setTimeout(function(){
//  console.log("hello");
// },3000)

app.get('/', (req, res) => {
    // res.render('view',
    listModel.find(function(err, docs)  {
        if (!err) {
            res.status(200).render('view', { rows: docs });
        } else {
            res.status(500).send("Error : " + err.message);
        }
    });
});

app.get('/about', (req, res) => {
       res.status(200).render('about');
});

app.get('/refreshTasks', (req, res) => {
    listModel.find(function(err, docs)  {
        if (!err) {
            res.status(200).send(docs);
        } else {
            res.status(500).send("Error : " + err.message);
        }
    });
});

//             res.send(docs); //res.send sends response once
//             // res.send("List Controller");
//         }


/**
 * fetching data items from request body
 * assigning to list variables
 * saving data in DB if no error
 */
app.post("/addTask", (req, res) => {
    //setting variables for list (add task)
    try{
    var newlist = new listModel();

    newlist.taskName = req.body.taskName;
    newlist.dueDate = req.body.dueDate;
    newlist.setAsImportant = req.body.setAsImportant;
    newlist.taskId = Math.random();
    newlist.save((err, doc) => {
        if (!err) {
            // res.json({ message: "Added task successfully!!", status: "OK" })
            // console.log("Added task successfully!!!");
            // res.redirect("/");
            res.status(200).send(newlist);
        } else {
            res.status(500).send(err.message);
        }
    });
    }
    catch(err){
    res.status(400).send("Error: Bad request");
   }  
});

app.post("/deleteTask", (req, res) => {
    var id = req.body.taskId;
    // listModel.deleteOne({ taskId: id }, (err, doc) => { //doc contains - {deletedCount: 1} (deleted elements in once)
    listModel.deleteOne({ taskId: id }, (err) => {
        if (!err) {
            res.status(200).send(id);
        } else {
            res.status(500).send(err.message);
        }
    });
    // listModel.findByIdAndRemove(id, function(err) {
})


/**
 * This method will update task in Database.
 */
 app.put("/updateTask", (req, res) => {
    var id = req.body.taskId;

    listModel.updateOne({ taskId: id }, req.body, (err) => {
        if (!err) {
            res.status(200).send(req.body);
        } else {
            res.status(500).send(err.message);
        }
    });
});

// app.get('/:id', (req, res) => {
//     // res.render('view',
//     listModel.find({id :req.params.id(err, docs) => {
//         if (!err) {
//             res.status(200).render('view', { rows: docs });
//         } else {
//             res.status(500).send("Error : " + err.message);
//         }
//     });
// });

app.listen(port, function() {
    console.log("Server is listening on " + port);
});