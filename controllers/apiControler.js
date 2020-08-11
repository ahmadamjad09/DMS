var MongoClient = require('mongodb').MongoClient;
var config = require('./../config');
var bodyParser = require('body-parser');


var url = config.getDbConnectionString();

module.exports = function(app) {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    

    app.get('/api/todos/', function(req, res) {

        var query = { username:  req.query.uname };
        console.log(query);

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodetodosample");
            dbo.collection("customers").find(query).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                db.close();
                res.send(result);
              });
          }); 
        
    });
    

    app.get('/', (req, res) => {
   
        MongoClient.connect(url, function(err, db) {
            tagline = "test";
            if (err) throw err;
            var dbo = db.db("nodetodosample");
            dbo.collection("customers").find({}).toArray(function(err, result) {
              if (err) throw err;
              db.close();
              res.render('./../views/pages/index', {
                result: result,
                taglines: tagline,
                title: "Home"
            });
            });
          }); 
          
       
    });

    app.get('/about', (req,res) => {
        res.render('./../views/pages/about');

    });

    app.post('/updat', (req,res) =>
    {
        console.log(req.body);
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodetodosample");
            var myquery = { username: req.body.uname };
            var newvalues = { $set: {todo: req.body.todo} };
            dbo.collection("customers").updateMany(myquery, newvalues, (err, res) => {
              if (err) throw err;
              db.close();
            });
            res.send("1 document updated");
          }); 
    });

    app.post('/insert', (req,res) =>
    {
   /*     var myobj = {
            username: "ahmad",
            todo: "Feed dog",
            isDone: false,
            hasAttachment: false
    };*/
       
   
    MongoClient.connect(url, function(err, db) {
     if (err) throw err;
     var dbo = db.db("nodetodosample");
     dbo.collection("customers").insertOne(req.body, function(err, res) {
         if (err) throw err;
        
       });
       dbo.collection("customers").find({}).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        res.render('./../views/pages/index', {
          result: result,
          taglines: tagline
      });
      });
   });
    });
    
}