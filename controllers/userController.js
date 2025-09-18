const userModel = require('../models/usermodel')
const cloudinary = require('../config/cloudinary')
const bcrypt = require('bcrypt');
const fs = require('fs');

exports.register = async (req,res) => {
    try {

        console.log(" joy")
        const {fullName,email,password,age,phoneNumber} = req.body;
        const file = req.file;
        let  response;
        const existEmail = await userModel.findOne({email: email.toLowerCase()});
        const existPhoneNumber = await userModel.findOne({phoneNumber: phoneNumber});
        console.log(" joy1")

        if(existEmail || existPhoneNumber){
             fs.unlinkSync(file.path)
            return res.status(400).json({
            messsage: 'User already exist'
            })
        };
        console.log(" joy2")

           if (file && file.path) {
       response = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path)
};

        console.log(" joy3")

    const saltRound = await bcrypt.genSalt(10);
            console.log(" joy4")

    const hashPassword = await bcrypt.hash(password, saltRound);

 

    const user = new userModel({
        fullName,
        email,
        password: hashPassword,
        age,
        phoneNumber,
        profilePicuture: {
            publicId: response.public_id,
            imageUrl: response.secure_url
        }
    });
    
//await user.save();
    res.status(201).json({
        statusCode: true,
        statusText: `Created`,
        message: `User created successfully`,
        data: user
    })
    } catch (error) {
     res.status(500).json({
        messsage:'Internal server error',
        error:error.message
     });
    }
}

exports.update = async (req,res) => {
    try {
      const {fullName,age} = req.body;
      const id = req.params.id;
      const file = req.file;
      let response;
      const user = await userModel.findById(id);
      if(!user){
        return res.status(404).json('user not found')
      };
      if (file && file.path) {
        await cloudinary.uploader.destroy(user.profilePicuture.public_id);
        response = await cloudinary.uploader.upload(file.path)
        fs.unlinkSync(file.path)
      }
      const userData = {
        fullName: fullName ?? user.fullName,
        age: age ?? user.age,
        profilePicuture:{
            imageUrl:response?.secure_url,
            publicId:response?.public_id
        }
      };
      
      const newData = Object.assign(user, userData)
      const update = await userModel.findByIdAndUpdate(user._id, newData, {new:true});

      res.status(200).json({
        message:'user updated successfully',
        data:update
      })
    } catch (error) {
  res.status(500).json({
    message:'internal server error',
    error:error.message
  })
    }
}
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (user.profilePicuture && user.profilePicuture.publicId) {
      await cloudinary.uploader.destroy(user.profilePicuture.publicId);
    }


    await userModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};