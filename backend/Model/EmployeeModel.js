const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    NIC: {
        type: String,
        required: true,
    },
    Gender: {
        type: String,
        required: true,
    },
    Adress: {
        type: String,
        required: true,
    },
    Position: {
        type: String,
        required: true,
    },
    ContactNumber: {
        type: String,
        required: true,
    },
    BasicSalary: {
        type: Number,
        required: true,
    },
    EPF: {
        type: Number,
        default: function() {
            // Automatically calculate EPF (example: 8% of Basic Salary)
            return this.BasicSalary * 0.08;
        }
    },
    ETF: {
        type: Number,
        default: function() {
            // Automatically calculate ETF (example: 3% of Basic Salary)
            return this.BasicSalary * 0.03;
        }
    },
    Bonus: {
        type: Number,
        default: 0, // Bonus can be added later
    },
    NetSalary: {
        type: Number,
        default: function() {
            // Automatically calculate Net Salary: Basic Salary - EPF - ETF + Bonus
            return this.BasicSalary - this.EPF - this.ETF + this.Bonus;
        }
    },
});

module.exports = mongoose.model("EmployeeModel", employeeSchema);
