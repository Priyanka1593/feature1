var app = require('../app.js').app;
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema=mongoose.Schema;
var Stock = require('../models/stock.js').Stock;

// Api call to generate 100 objects
app.get('/addStock',(req,res)=>{
    var arr = new Array();
    var doc = new Stock({itemNo: 1, itemName: 'A1',stockQty:50 });
    for(i=1; i <= 10; i++){
            var stock_obj = {};
            stock_obj.itemNo = i;
            stock_obj.itemName = `Item_${i}`;
            stock_obj.stockQty = 50;
            stock_obj.stockSold = 0;
            stock_obj.stockLevel= stock_obj.stockQty - stock_obj.stockSold; // Apply Formulae
            arr.push(stock_obj);
    }

    // Insert 100 documents of stock sells data in mongoDB
    Stock.insertMany(arr,(err,result)=>{
        if(err){
            console.log('Error Occured');
        }
        else{
           console.log('Inserted');
        }
    });
    res.send('Inserted');
});


// Api call to update stock
app.get('/updateStock/:t',(req1,res1)=>{
    
    var counter = 0;
    var time = req1.params.t; // In our case -- req.params.t eill be 5 ehich is 5 mins
    var totalSeconds = time * 60; // take time into seconds
     var  updateData = (c) => {
                console.log(`Update  Counter-${c} Seconds Remain ${totalSeconds}`);
                if(totalSeconds > 0){
                        totalSeconds--; 
                        // find each record and call the promise
                        Stock.find( {itemNo : c})
                        .then ( (item)=>{
                                        // Update the record which we have found
                                        var newValues ={};
                                        newValues.stockSold =item[0].stockSold +  1;
                                        newValues.stockLevel = item[0].stockQty - newValues.stockSold;
                                return Stock.update({itemNo : c}, newValues); //return the promise
                        })
                        .then( (raw)=>{

                         }).catch( (error)=>{
                             console.log('Error while updating the record ' + c);  
                        });
                    
                      stockData();    // Call stockData after updating each record.
                }else{
                    // After completing 5 minutes fetch the records from collection
                    // Write those records to log.txt file
                    Stock.find({}, function(err, docs){
		                if(err) res.json(err);
		                    else{
                                    fs.appendFile('log.txt', docs, function (err) {
                                            if (err) {
                                                console.log('Error');
                                            } else {                                              
                                            }
                                    })
                                }
	                });
                }
            }   
        
        function stockData(){

         //   console.log(`In the StockData with counter - ${counter} `);

         /* If the counter is 100 we are again executing the update task by starting from firs record
          else we are incrementing the counter so that next record in order will gets updated.*/
             if(counter === 10){
                 counter = 1;
             }else{
                 counter = counter + 1;
             }
             setTimeout(updateData,1000, counter);   //call setTimeout after 1 second till it reaches to 5 minutes
        }
       // Calling the Stack Data
        stockData();  // Call to stockData function when the user hits the api for the first time.
        res1.send('Update initiated');      
});
   

  

