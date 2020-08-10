var express = require('express');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config');
var setupcontroler = require('./controllers/setupController');
var apicontroler = require('./controllers/apiControler');

var url = config.getDbConnectionString();

var port = process.env.PORT || 3000;
app.use('/static', express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs');


setupcontroler(app);
apicontroler(app);


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  })