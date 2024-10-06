import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';

function UpdateEmployee() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/employees/${id}`);
                setInputs(res.data.employee);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        try {
            await axios.put(`http://localhost:5000/employees/${id}`, {
                FirstName: String(inputs.FirstName),
                LastName: String(inputs.LastName),
                NIC: String(inputs.NIC),
                Gender: String(inputs.Gender),
                Adress: String(inputs.Adress),
                Position: String(inputs.Position),
                ContactNumber: String(inputs.ContactNumber),
                BasicSalary: Number(inputs.BasicSalary), // Add Basic Salary here
            });
            navigate('/employeedetails');
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest();
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Update Employee</h1>
            <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>First Name</label>
                    <input
                        type="text"
                        name="FirstName"
                        onChange={handleChange}
                        value={inputs.FirstName || ""}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Last Name</label>
                    <input
                        type="text"
                        name="LastName"
                        onChange={handleChange}
                        value={inputs.LastName || ""}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>NIC</label>
                    <input
                        type="text"
                        name="NIC"
                        onChange={handleChange}
                        value={inputs.NIC || ""}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Gender</label>
                    <select
                        name="Gender"
                        onChange={handleChange}
                        value={inputs.Gender || ""}
                        style={styles.select}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Address</label>
                    <input
                        type="text"
                        name="Adress"
                        onChange={handleChange}
                        value={inputs.Adress || ""}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Position</label>
                    <select
                        name="Position"
                        onChange={handleChange}
                        value={inputs.Position || ""}
                        style={styles.select}
                        required
                    >
                        <option value="">Select Position</option>
                        <option value="Farm Manager">Farm Manager</option>
                        <option value="Farm Owner">Farm Owner</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="Task Manager">Task Manager</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Contact Number</label>
                    <input
                        type="text"
                        name="ContactNumber"
                        onChange={handleChange}
                        value={inputs.ContactNumber || ""}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Basic Salary</label>
                    <input
                        type="number"
                        name="BasicSalary"
                        onChange={handleChange}
                        value={inputs.BasicSalary || ""}
                        style={styles.input}
                        required
                    />
                </div>
                <button type="submit" style={styles.updateButton}>Update Employee</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f4f4f9',
        minHeight: '100vh',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '500px',
        padding: '40px',
        backgroundColor: '#A2CA71',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '8px',
        fontSize: '16px',
        color: '#333',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
        color: '#333',
        width: '100%',
    },
    select: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
        color: '#333',
        width: '100%',
    },
    updateButton: {
        padding: '12px 0',
        backgroundColor: '#557C56',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '10px',
        fontWeight: 'bold',
    },
};

export default UpdateEmployee;
