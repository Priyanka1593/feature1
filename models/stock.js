var mongoose=require('mongoose');
const Schema=mongoose.Schema;
var Stock = mongoose.model('Stock', new mongoose.Schema( {
    itemNo:{
        type:Number
    },
    itemName:{
        type:String
    },
    stockQty:{
        type:Number
    },
    stockSold:{
        type:Number
    },
    stockLevel:{
        type:Number
    }
}));

module.exports={Stock};