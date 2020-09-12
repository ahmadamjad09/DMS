var MongoClient = require('mongodb').MongoClient;
var config = require('./../config');
var bodyParser = require('body-parser');


var url = config.getDbConnectionString();

module.exports = function(app) {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    

   
    

    app.get('/', (req, res) => {
     
        var date_now = getCuttent_Date();
        MongoClient.connect(url, function(err, db) {
            tagline = "test"; 
            if (err) throw err;
            var dbo = db.db("DMS");
            dbo.collection("dailystats").find({}).toArray(function(err, result) {
              if (err) throw err;
              db.close();
              console.log(result);
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
      var count = 0;
      var earning = 0;
     
      
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DMS");
        dbo.collection("dailyerningexpense").find({}, { projection: { _id: 0, id: 0, expense:0 } }).toArray(function(err, result) {
          if (err) throw err;
          console.log(result[0]);
          count = result[0].count;
          earning = result[0].earning;
          console.log(result[0].date);
         
          //console.log(date_previous);localeCompare
         
          if ( date_now.localeCompare(result[0].date))
          {
            var myquery = { id: 1 };
            var newvalues = { $set: {count: 0, date: date_now } };
            dbo.collection("dailyerningexpense").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
              count = 0;
              
              
            }); 
            console.log("Day Change");
          }
          //else {
            //console.log("Same Day");
             res.render('./../views/pages/earningExpense', {
          title: "DMS-Earning",
          date: date_now,
          count: count,
          earning: earning
        });
          //}
        });
      });   
    });
    
    app.post('/earningSave', (req,res) => {

      var from_earning = parseInt(req.body.earning);
      console.log(from_earning);
      var date_now = getCuttent_Date();
      var count = 0;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DMS");
        dbo.collection("dailyerningexpense").find({}, { projection: { _id: 0, id: 0, expense:0 } }).toArray(function(err, result) {
          if (err) throw err;
          console.log(result[0]);
          count = result[0].count + 1 ;
          from_earning +=  result[0].earning;
          console.log(from_earning);
          console.log(result[0].date);
          var myquery = { id: 1 };
          var newvalues = { $set: {count: count, earning: from_earning } };
          dbo.collection("dailyerningexpense").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          }); 
          if ( date_now.localeCompare(result[0].date))
          {
            var myquery = { id: 1 };
            var newvalues = { $set: {count: 0, date: date_now } };
            dbo.collection("dailyerningexpense").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
              count = 0;
            }); 
            console.log("Day Change");
          }
             res.render('./../views/pages/earningExpense', {
          title: "DMS-Earning",
          date: date_now,
          count: count,
          earning: from_earning
        });
        });
      });   
    });

    app.post('/expenseSave', (req,res) => {

      var from_expense = parseInt(req.body.expense);
      console.log(from_expense);
      var date_now = getCuttent_Date();
      var count = 0;
      var earning = 0;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DMS");
        dbo.collection("dailyerningexpense").find({}, { projection: { _id: 0, id: 0, } }).toArray(function(err, result) {
          if (err) throw err;
          console.log(result[0]);
          count = result[0].count  ;
          earning =  result[0].earning;
          from_expense += result[0].expense;
          console.log(from_expense);
          console.log(result[0].date);
          var myquery = { id: 1 };
          var newvalues = { $set: {expense: from_expense } };
          dbo.collection("dailyerningexpense").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          }); 
          if ( date_now.localeCompare(result[0].date))
          {
            var myquery = { id: 1 };
            var newvalues = { $set: {count: 0, date: date_now } };
            dbo.collection("dailyerningexpense").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
              count = 0;
            }); 
            console.log("Day Change");
          }
             res.render('./../views/pages/earningExpense', {
          title: "DMS-Earning",
          date: date_now,
          count: count,
          earning: earning
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