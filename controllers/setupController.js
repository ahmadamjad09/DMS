var MongoClient = require('mongodb').MongoClient;
var config = require('./../config');

var url = config.getDbConnectionString();

module.exports = function(app) {
    
   app.get('/api/setupTodos', function(req, res) {
       
       // seed database
       var myobj = {
               username: "ahmad",
               todo: "Feed dog",
               isDone: false,
               hasAttachment: false
       };
          
      
       MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nodetodosample");
        dbo.collection("customers").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            
          });
        res.send("1 Row inserted");
        db.close();
      });
      res.send("1 Row inserted");
    
       
   });
    
}