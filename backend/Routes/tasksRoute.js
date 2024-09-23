const express = require("express");
const Task = require('../Model/taskModel.js');
const { mongoDBURL } = require('../config.js');
const mongoose = require('mongoose');


const router = express.Router();

// Route to save a new task
router.post("/", async (request, response) => {
    try {
        const { title, description, dueDate, priority, category, tags, isCompleted } = request.body;

        if (!title || !description || !dueDate || !priority) {
            return response.status(400).send({ message: "Please fill all the required fields" });
        }

        const newTask = {
            title: title.trim(),
            description: description.trim(),
            dueDate,
            priority: priority.trim(),
            category: category?.trim() || 'Orders', // Default to 'Orders' if category is not provided
            tags: tags || [], // Default to empty array if tags are not provided
            isCompleted: isCompleted || false, // Default to false
        };

        const task = await Task.create(newTask);
        return response.status(201).send({ task });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get ALL tasks from the database
router.get("/", async (request, response) => {
    try {
        const tasks = await Task.find({});
        return response.status(200).json({
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get 1 task from the database by ID
router.get("/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const task = await Task.findById(id);
        if (!task) {
            return response.status(404).json({ message: "Task not found" });
        }
        return response.status(200).json(task);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to update a task
router.put("/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const { title, description, dueDate, priority, category, tags, isCompleted } = request.body;

        if (!title || !description || !dueDate || !priority) {
            return response.status(400).send({ message: "Please fill all the required fields" });
        }

        const updatedTask = {
            title: title.trim(),
            description: description.trim(),
            dueDate,
            priority: priority.trim(),
            category: category?.trim() || 'Orders',
            tags: tags || [],
            isCompleted: isCompleted || false,
        };

        const result = await Task.findByIdAndUpdate(id, updatedTask, { new: true });
        if (!result) {
            return response.status(404).json({ message: "Task not found" });
        }
        return response.status(200).send({ task: result });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to delete a task
router.delete("/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Task.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: "Task not found" });
        }
        return response.status(200).send({ message: "Task deleted" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get incomplete tasks
router.get("/IncompleteTasks", async (request, response) => {
    try {
        const tasks = await Task.find({ isCompleted: false });
        return response.status(200).json({
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get overdue tasks
router.get("/OverdueTasks", async (request, response) => {
    try {
        const tasks = await Task.find({ dueDate: { $lt: new Date() }, isCompleted: false });
        return response.status(200).json({
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get urgent tasks
router.get("/UrgentTasks", async (request, response) => {
    try {
        const tasks = await Task.find({ priority: 'Urgent', isCompleted: false });
        return response.status(200).json({
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;
