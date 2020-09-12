var MongoClient = require('mongodb').MongoClient;
var config = require('./../config');

var url = config.getDbConnectionString();

module.exports = function(app) {
    
   app.get('/api/setup', function(req, res) {
       
       // seed database
       var myobj = {
               id: 1,
               earning: 6000,
               expense: 2000,
               date: "2-9-2020"
       };
          
      
       MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DMS");
        dbo.collection("dailystats").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            
          });
        res.send("1 Row inserted");
        db.close();
      });
      res.send("1 Row inserted");
    
       
   });
    
}