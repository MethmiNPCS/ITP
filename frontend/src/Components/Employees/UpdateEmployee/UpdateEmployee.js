import React, { useState, useEffect } from 'react'; // Added useEffect import
import axios from 'axios';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

function UpdateEmployee() {

    const [inputs, setInputs] = useState({});
    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            await axios
                .get(`http://localhost:5000/employees/${id}`)
                .then((res) => res.data)
                .then((data) => setInputs(data.employee));
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        await axios
            .put(`http://localhost:5000/employees/${id}`, {
                FirstName: String(inputs.FirstName),
                LastName: String(inputs.LastName),
                NIC: String(inputs.NIC),
                Gender: String(inputs.Gender),
                Adress: String(inputs.Adress),
                Position: String(inputs.Position),
                ContactNumber: String(inputs.ContactNumber),
            })
            .then(res => res.data);
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputs);
        sendRequest().then(() => history('/employeedetails'));  
    };

    return (
        <div>
            <h1>Update Employee</h1>
            <center>
                <h1>Add Employee</h1>
                <form onSubmit={handleSubmit}>
                    <label>FirstName</label>
                    <br />
                    <input type="text" name="FirstName" onChange={handleChange} value={inputs.FirstName} required />
                    <br /><br />
                    <label>LastName</label>
                    <br />
                    <input type="text" name="LastName" onChange={handleChange} value={inputs.LastName} required />
                    <br /><br />
                    <label>NIC</label>
                    <br />
                    <input type="text" name="NIC" onChange={handleChange} value={inputs.NIC} required />
                    <br /><br />
                    <label>Gender</label>
                    <br />
                    <select name="Gender" onChange={handleChange} value={inputs.Gender} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <br /><br />
                    <label>Adress</label>
                    <br />
                    <input type="text" name="Adress" onChange={handleChange} value={inputs.Adress} required />
                    <br /><br />
                    <label>Position</label>
                    <br />
                    <select name="Position" onChange={handleChange} value={inputs.Position} required>
                        <option value="">Select Position</option>
                        <option value="Farm Manager">Farm Manager</option>
                        <option value="Farm Owner">Farm Owner</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="Task Manager">Task Manager</option>
                    </select>
                    <br /><br />
                    <label>ContactNumber</label>
                    <br />
                    <input type="text" name="ContactNumber" onChange={handleChange} value={inputs.ContactNumber} required />
                    <br /><br />
                    <button type="submit">Update Employee</button>
                </form>
            </center>
        </div>
    );
}

export default UpdateEmployee;
