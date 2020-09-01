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
     
        var date_now = getCuttent_Date();
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
                title: "Home",
                date: date_now
            });
            });
          }); 
          
       
    });

    app.get('/earning', (req,res) => {
      var date_now = getCuttent_Date();
     
      
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DMS");
        dbo.collection("dailyerningexpense").find({}, { projection: { _id: 0, id: 0, count: 0, earning:0, expense:0 } }).toArray(function(err, result) {
          if (err) throw err;
         // console.log(result[0].date);
          //console.log(date_previous);
         
          if ( result[0].date < date_now)
          {
            var myquery = { id: 1 };
            var newvalues = { $set: {count: 0, date: date_now } };
            dbo.collection("dailyerningexpense").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
              
            }); 
            console.log("Day Change");
          }
          else {
            console.log("Same Day");
          }
        });
      });
        res.render('./../views/pages/earningExpense', {
          title: "DMS-Earning",
          date: date_now
        });

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
function getCuttent_Date()
{
  var current_date = new Date();
  var date_now = "";
  date_now = current_date.getFullYear() + '-' + (current_date.getMonth()+1) + '-' + current_date.getDate();
 return date_now
}