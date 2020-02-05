// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//HTML routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

//API routes
app.get("/api/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "../db/db.json"));
});

//README* POST `/api/notes` - Should recieve a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function(req, res) {
  //captures incoming req.body
  let newNote = req.body;
  // console.log("newNotes: ", newNote);
  //reads the existing db.json
  fs.readFile("../db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    //parses the data out of stringified
    let database = JSON.parse(data);
    // console.log("Parsed database: ", database);
    //pushes newNote to update database
    database.push(newNote);
    //add note id starting with 0
    let idKey = 0
    for( let i = 0; i < database.length; i++){
      database[i].id = idKey++;
    }
    // console.log("Updated Database with post: ", database);
    //write the updated database var to db.json file
    fs.writeFile("../db/db.json", JSON.stringify(database), function(err){
      if (err) throw err;
      //returns status and message as response
      return res.status(200).send("Note added");
    })
  });
});

//  * DELETE `/api/notes/:id` - Should recieve a query paramter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete("/api/notes/:id", function(req, res) {
  fs.readFile("../db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    let database = JSON.parse(data);
    var paramId = parseInt(req.params.id);
    // console.log("Database: ", database);
    // console.log("id from param: ", paramId);

    const updatedDatabase = database.filter(obj => obj.id !== paramId);
    // console.log("updatedDatabase: ", updatedDatabase);

    fs.writeFile("../db/db.json", JSON.stringify(updatedDatabase), function(err){
      if (err) throw err;
      return res.status(200).send("Note deleted");
    })
  });
});

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });