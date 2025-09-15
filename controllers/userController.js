const userModel = require("../models/usermodel");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, age, phoneNumber } = req.body;
    const existEmail = await userModel.findOne({ email: email.toLowerCase() });
    const existPhoneNumber = await userModel.findOne({
      phoneNumber: phoneNumber,
    });
    if (existEmail || existPhoneNumber) {
      return res.status(400).json({
        messsage: "User already exist",
      });
    }
    const saltRound = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, saltRound);

    const user = new userModel({
      fullName,
      email,
      password: hashPassword,
      age,
      phoneNumber,
    });

    //await user.save();
    res.status(201).json({
      statusCode: true,
      statusText: `Created`,
      message: `User created successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      messsage: "Internal server error",
      error: error.message,
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
