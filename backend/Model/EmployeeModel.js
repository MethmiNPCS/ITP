const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const employeeSchema = new Schema({
    FirstName:{
        type:String,
        required:true,
    },

    LastName:{
        type:String,
        required:true,
    },

    NIC:{
        type:String,
        required:true,
    },

    Gender:{
        type:String,
        required:true,
    },

    Adress:{
        type:String,
        required:true,
    },

    Position:{
        type:String,
        required:true,
    },

    ContactNumber:{
        type:String,
        required:true,
    }

});
module.exports =mongoose.model(
    "EmployeeModel",
    employeeSchema

)
