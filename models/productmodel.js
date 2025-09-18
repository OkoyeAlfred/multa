const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  productName:{
    type:String,
    require:true,
    trim: true
  },

  productImages:{
   imageUrl:{
    type:String,
    require:true
   },
   publicId:{
    type:String,
    require:true
   }
  }
}, {Timestamps: true});

const productModel = mongoose.model('products', ProductSchema)
module.exports = productModel;