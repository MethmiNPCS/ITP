const express = require('express');
const salaryRouter = express.Router();
const Salary = require('../Model/SalaryModel');

// Create Salary
salaryRouter.post('/', async (req, res) => {
    const { employeeNIC, baseSalary, hoursWorked, overtimeHours = 0, overtimeRate = 1.5, deductions = 0, bonuses = 0 } = req.body;

    // Calculate overtime pay and total salary
    const overtimePay = overtimeHours * baseSalary * overtimeRate;
    const totalSalary = (baseSalary * hoursWorked) + overtimePay + bonuses - deductions;

    let salary;
    try {
        // Create a new Salary document
        salary = new Salary({
            employeeNIC,
            baseSalary,
            hoursWorked,
            overtimeHours,
            overtimeRate,
            deductions,
            bonuses,
            totalSalary,
            payDate: new Date()  // Set pay date to the current date
        });
        await salary.save();  // Save the salary document to the database
    } catch (err) {
        return res.status(500).json({ message: "Unable to save salary" });
    }

    return res.status(200).json({ salary });  // Return the saved salary document
});

// Get Salary by Employee NIC
salaryRouter.get('/:nic', async (req, res) => {
    const nic = req.params.nic;
    let salary;
    try {
        // Find salary by employeeNIC
        salary = await Salary.findOne({ employeeNIC: nic });
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving salary data" });
    }

    if (!salary) {
        return res.status(404).json({ message: "Salary not found" });  // If no salary found
    }

    return res.status(200).json({ salary });  // Return the found salary document
});

// Get All Salaries
salaryRouter.get('/', async (req, res) => {
    try {
        const salaries = await Salary.find();  // Fetch all salary documents
        return res.status(200).json({ salaries });
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving salaries" });
    }
});

// Update Salary by Employee NIC
salaryRouter.put('/:nic', async (req, res) => {
    const nic = req.params.nic;
    const { baseSalary, hoursWorked, overtimeHours = 0, overtimeRate = 1.5, deductions = 0, bonuses = 0, payDate } = req.body;

    // Calculate overtime pay and total salary
    const overtimePay = overtimeHours * baseSalary * overtimeRate;
    const totalSalary = (baseSalary * hoursWorked) + overtimePay + bonuses - deductions;

    try {
        // Find salary by employeeNIC and update the fields
        const updatedSalary = await Salary.findOneAndUpdate(
            { employeeNIC: nic },
            {
                baseSalary,
                hoursWorked,
                overtimeHours,
                overtimeRate,
                deductions,
                bonuses,
                totalSalary,
                payDate: payDate ? new Date(payDate) : new Date()  // Use provided payDate or set current date
            },
            { new: true }  // Return the updated document
        );

        if (!updatedSalary) {
            return res.status(404).json({ message: "Salary not found" });
        }

        return res.status(200).json({ updatedSalary });  // Return the updated salary document
    } catch (err) {
        return res.status(500).json({ message: "Error updating salary" });
    }
});

module.exports = salaryRouter;  // Export the salary router
