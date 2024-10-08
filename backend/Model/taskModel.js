const mongoose = require("mongoose");
const mongooseSequence = require('mongoose-sequence');


const AutoIncrement = mongooseSequence(mongoose);

const taskSchema = new mongoose.Schema({
    
    taskNo: {
        type: Number,
        unique: true, 
        index: true
    },
    
    title: {
        type: String,
        required : true
    },
    description: {
        type: String,
        required : true
    },
    dueDate: {
        type: Date,
        required : true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'], // Only these values are allowed
        required : true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    },

    category: {
        type: String,
        enum: ['Orders', 'Stocks', 'Livestock Health', 'Products', 'Employees', 'Maintenance','Plantation'], 
        default: 'Orders'
    },
    tags:{
        type: [String],
        default: []
    } ,
    reminder: Date,
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeModel' } // Add this line
});

taskSchema.plugin(AutoIncrement, { inc_field: 'taskNo' });

module.exports = mongoose.model("Task", taskSchema);
