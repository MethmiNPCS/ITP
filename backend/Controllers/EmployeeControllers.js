const Employee = require("../Model/EmployeeModel");

const getAllEmployees = async (req,res,next) =>{

    let employees;
    // Get all Employees
    try {
        employees = await Employee.find();
    } catch (err) {
        console.log(err);
    }
    // Employee not found
    if(!employees){
        return res.status(404).json({message:"Employee not found"});
    }

    // Display all employees
    return res.status(200).json({employees});
};

//data insert
const addEmployee =async(req,res,next)=>{
    const {FirstName,LastName,NIC,Gender,Adress,Position,ContactNumber} =req.body;

    let employees;
    try{
        employees =new Employee ({FirstName,LastName,NIC,Gender,Adress,Position,ContactNumber});
        await employees.save();
    }
    catch (err){
        console.log(err);
    }

    //not inserting employee
    if(!employees){
        return res.status(404).json({message:" unable to add Employee"});
    }
    return res.status(200).json({employees});

};

// get by id
 const getById = async(req,res,next) =>{

    const id = req.params.id;

    let employee;

    try {
        employee = await Employee.findById(id);
    } catch (err) {
        console.log(err);
    }

    //not available employee
    if(!employee){
        return res.status(404).json({message:"Employee not Found"});
    }
    return res.status(200).json({employee});
 };

 // Update Employee Details
 const updateEmployee =async (req,res,next)=>{
    const id = req.params.id;
    const {FirstName,LastName,NIC,Gender,Adress,Position,ContactNumber} =req.body;

    let employee;

    try {
        employee = await Employee.findByIdAndUpdate(id,
        {FirstName: FirstName, LastName: LastName ,NIC:NIC ,Gender:Gender, Adress: Adress, Position: Position ,ContactNumber:ContactNumber});
        employee = await employee.save();

    } catch (err) {
        console.log(err);
    }

    //if
    if(!employee){
        return res.status(404).json({message:"Unable to Update Employee Details"});
    }
    return res.status(200).json({employee});
 };

 // Delete Employee Details
 const deleteEmployee =async (req,res,next)=>{
    const id = req.params.id;

    let employee;

    try {
        employee = await Employee.findByIdAndDelete(id)        

    } catch (err) {
        console.log(err);
    }

    //if
    if(!employee){
        return res.status(404).json({message:"Unable to Delete Employee Details"});
    }
    return res.status(200).json({employee});
 };





exports.getAllEmployees = getAllEmployees;
exports.addEmployee =addEmployee;
exports.getById =getById;
exports.updateEmployee =updateEmployee;
exports.deleteEmployee =deleteEmployee;













