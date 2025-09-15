const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullName:{
    type:String,
    require:true,
    trim: true
  },
  email:{
    type:String,
    require:true,
    unique:true,
    trim:true,
    lowercase:true
  },
  password:{
    type:String,
    require:true
  },
  age:{
    type:Number,
    require:true
  },
  phoneNumber: {
    type:String,
    require:true,
    trim:true,
  },
  profilePicture:{
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

const userModel = mongoose.model('Users', userSchema)
module.exports = userModel;