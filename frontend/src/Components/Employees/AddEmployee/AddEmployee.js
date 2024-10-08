import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddEmployee() {
    const history = useNavigate();
    const [inputs, setInputs] = useState({
        FirstName: "",
        LastName: "",
        NIC: "",
        Gender: "",
        Adress: "",
        Position: "",
        ContactNumber: "",
        BasicSalary: "",
        AddDate:"",
    });
    
    const [errors, setErrors] = useState({}); // State to hold validation errors

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Reset errors
        setErrors({});

        // Validation checks
        const validationErrors = {};
        if (!validateContactNumber(inputs.ContactNumber)) {
            validationErrors.ContactNumber = "Contact number must be exactly 10 digits long and contain only numbers.";
        }

        if (!validateNIC(inputs.NIC)) {
            validationErrors.NIC = "NIC must be exactly 12 characters long and contain only numbers.";
        }

        if (!validateBasicSalary(inputs.BasicSalary)) {
            validationErrors.BasicSalary = "Basic salary must be a valid number.";
        }

        // Set errors if any
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log(inputs);
        sendRequest().then(() => history('/EmployeeDetails'));
    };

    const validateContactNumber = (contactNumber) => {
        // Check if the contact number is exactly 10 digits and numeric
        const regex = /^\d{10}$/; // Regular expression for exactly 10 digits
        return regex.test(contactNumber);
    };

    const validateNIC = (nic) => {
        // Check if the NIC number is 12 characters long and numeric
        const regex = /^\d{12}$/; // Regular expression for exactly 12 digits
        return regex.test(nic);
    };

    const validateBasicSalary = (basicSalary) => {
        // Check if the Basic Salary is a valid number (integer or decimal)
        const regex = /^[0-9]+(\.[0-9]+)?$/; // Regular expression for a valid number
        return regex.test(basicSalary);
    };

    const sendRequest = async () => {
        await axios.post("http://localhost:5000/employees", {
            FirstName: String(inputs.FirstName),
            LastName: String(inputs.LastName),
            NIC: String(inputs.NIC),
            Gender: String(inputs.Gender),
            Adress: String(inputs.Adress),
            Position: String(inputs.Position),
            ContactNumber: String(inputs.ContactNumber),
            BasicSalary: Number(inputs.BasicSalary),
            AddDate: Date(inputs.BasicSalary),
        }).then(res => res.data);
    };

    return (
        <div>
            <Nav />
            <div style={styles.formContainer}>
                <h1 style={styles.title}>Add Employee</h1>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="firstName" style={styles.label}>First Name</label>
                        <input type="text" id="firstName" name="FirstName" onChange={handleChange} value={inputs.FirstName} required style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="lastName" style={styles.label}>Last Name</label>
                        <input type="text" id="lastName" name="LastName" onChange={handleChange} value={inputs.LastName} required style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="nic" style={styles.label}>NIC</label>
                        <input type="text" id="nic" name="NIC" onChange={handleChange} value={inputs.NIC} required style={styles.input} />
                        {errors.NIC && <p style={styles.error}>{errors.NIC}</p>} {/* Display NIC error */}
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="gender" style={styles.label}>Gender</label>
                        <select id="gender" name="Gender" onChange={handleChange} value={inputs.Gender} required style={styles.input}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="address" style={styles.label}>Address</label>
                        <input type="text" id="address" name="Adress" onChange={handleChange} value={inputs.Adress} required style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="position" style={styles.label}>Position</label>
                        <select id="position" name="Position" onChange={handleChange} value={inputs.Position} required style={styles.input}>
                            <option value="">Select Position</option>
                            <option value="Farm Manager">Farm Manager</option>
                            <option value="Farm Owner">Farm Owner</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Task Manager">Task Manager</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="contactNumber" style={styles.label}>Contact Number</label>
                        <input type="text" id="contactNumber" name="ContactNumber" onChange={handleChange} value={inputs.ContactNumber} required style={styles.input} />
                        {errors.ContactNumber && <p style={styles.error}>{errors.ContactNumber}</p>} {/* Display contact number error */}
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="basicSalary" style={styles.label}>Basic Salary:</label>
                        <input type="text" id="basicSalary" name="BasicSalary" onChange={handleChange} value={inputs.BasicSalary} required style={styles.input} />
                        {errors.BasicSalary && <p style={styles.error}>{errors.BasicSalary}</p>} {/* Display basic salary error */}
                    </div>

                    <div style={styles.formGroup}>
  <label htmlFor="date" style={styles.label}>Date</label>
  <input 
    type="date" 
    id="date" 
    name="date" 
    onChange={handleChange} 
    value={inputs.date} 
    required 
    style={styles.input} 
  />
</div>
                    
                    <button type="submit" style={styles.submitButton}>Add Employee</button>
                </form>
                <div style={styles.formFooter}>
                    <p>All fields are required.</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    formContainer: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        margin: '50px auto',
        marginTop: '100px',
        backgroundColor:'#C1F2B0',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
    },
    submitButton: {
        width: '100%',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
    },
    formFooter: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px',
        color: '#777',
    },
    error: {
        color: 'red',
        fontSize: '12px',
        marginTop: '5px',
    }
};

export default AddEmployee;
