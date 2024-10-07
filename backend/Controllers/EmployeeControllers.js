const Employee = require("../Model/EmployeeModel");

const getAllEmployees = async (req, res, next) => {
    let employees;
    try {
        employees = await Employee.find();
    } catch (err) {
        console.log(err);
    }
    if (!employees) {
        return res.status(404).json({ message: "Employees not found" });
    }
    return res.status(200).json({ employees });
};

// Add Employee
const addEmployee = async (req, res, next) => {
    const { FirstName, LastName, NIC, Gender, Adress, Position, ContactNumber, BasicSalary,AddDate} = req.body;
    let employees;
    try {
        employees = new Employee({ FirstName, LastName, NIC, Gender, Adress, Position, ContactNumber, BasicSalary,AddDate });
        await employees.save();
    } catch (err) {
        console.log(err);
    }
    if (!employees) {
        return res.status(404).json({ message: "Unable to add Employee" });
    }
    return res.status(200).json({ employees });
};

// Get Employee by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    let employee;
    try {
        employee = await Employee.findById(id);
    } catch (err) {
        console.log(err);
    }
    if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json({ employee });
};

// Update Employee
const updateEmployee = async (req, res, next) => {
    const id = req.params.id;
    const { FirstName, LastName, NIC, Gender, Adress, Position, ContactNumber, BasicSalary,AddDate } = req.body;
    let employee;
    try {
        employee = await Employee.findByIdAndUpdate(id, {
            FirstName, LastName, NIC, Gender, Adress, Position, ContactNumber, BasicSalary,AddDate
        });
        employee = await employee.save();
    } catch (err) {
        console.log(err);
    }
    if (!employee) {
        return res.status(404).json({ message: "Unable to Update Employee" });
    }
    return res.status(200).json({ employee });
};

// Delete Employee
const deleteEmployee = async (req, res, next) => {
    const id = req.params.id;
    let employee;
    try {
        employee = await Employee.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    if (!employee) {
        return res.status(404).json({ message: "Unable to Delete Employee" });
    }
    return res.status(200).json({ employee });
};

// Add Bonus by Position
const addBonusByPosition = async (req, res, next) => {
    const { position, bonusAmount } = req.body;
    try {
        const employees = await Employee.find({ Position: position });

        if (employees.length === 0) {
            return res.status(404).json({ message: "No employees found for this position" });
        }

        for (let employee of employees) {
            employee.Bonus += parseFloat(bonusAmount);
            employee.NetSalary = employee.BasicSalary - employee.EPF - employee.ETF + employee.Bonus;
            await employee.save();
        }

        res.status(200).json({ message: "Bonus added to employees", employees });
    } catch (error) {
        console.error("Error adding bonus by position:", error);
        res.status(500).json({ message: "Error adding bonus by position", error });
    }
};

module.exports = {
    getAllEmployees,
    addEmployee,
    getById,
    updateEmployee,
    deleteEmployee,
    addBonusByPosition
};
