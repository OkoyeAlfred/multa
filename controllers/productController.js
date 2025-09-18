const productModel = require('../models/productmodel');
const cloudinary = require('../config/cloudinary');
const { response } = require('express');

exports.products = async (req,res) => {
    try {
       const {productName} = req.body;
       const files = req.files 

       if (files && files.length > 0) {
       for (const file of files) {
        response = await cloudinary
       }
       }
    } catch (error) {
       res.status(500).json({
        message:'Internal server error',
        error:error.message
       }) 
    }
}

exports.update = async (req,res) => {
  try {
    const {productName} = req.body;
    const id = req.params.id;
    const products = await productModel.findById(id);
    const files = req.files;
if (!products) {
    return res.status(404).json({
        message:'user not found',
        error:error.message
    })
};
if (files && files.length > 0) {
    for (const product of products.productImages){
        await cloudinary.uploader.destroy (product.publlicId)
    }
     const uploadedImages = [];
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path);
        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
      products.productImages = uploadedImages;
    }

    // Update fields
    products.productName = productName ?? products.productName;

    await products.save();

    res.status(200).json({
      message: 'Product updated successfully',
      data: products
    });
} catch (error) {
        res.status(500).json({
        message:'Internal server error',
        error:error.message
       }) 
  }  
}
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const products = await productModel.findById(id);

    if (!products) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    if (products.productImages && products.productImages.length > 0) {
      for (const product of products.productImages) {
        await cloudinary.uploader.destroy(product.publicId);
      }
    }

    // Delete from database
    await productModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};