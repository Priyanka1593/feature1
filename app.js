const express = require('express');
const db=require('./db/db-config.js');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
const port=process.env.PORT || 3000;
module.exports = {app};

var Stock = require('./models/stock.js');
var stockService = require('./services/stockService.js');


// Listen to the port
app.listen(port, ()=>{
    console.log(`** Listening to the ${port} **`);
});