var MongoClient = require('mongodb').MongoClient;
var config = require('./../config');

var url = config.getDbConnectionString();

module.exports = function(app) {
    
   app.get('/api/setup', function(req, res) {
       
       // seed database
       var myobj = {
               id: 1,
               count: 0,
               earning: 0.0,
               expense: 0.0,
               date: "2-9-2020"
       };
          
      
       MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DMS");
        dbo.collection("dailyerningexpense").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            
          });
        res.send("1 Row inserted");
        db.close();
      });
      res.send("1 Row inserted");
    
       
   });
    
}