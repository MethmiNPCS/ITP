import React from "react";
import {Route, Routes} from "react-router";
import './App.css';
import Home from './Components/Home/Home';

// Stock Routes
import StockHome from './Components/Stocks/StockHome';
import AddFood from './Components/Stocks/AddStock/AddFood';
import AddMedicine from "./Components/Stocks/AddStock/AddMedicine";
import Foods from "./Components/Stocks/StockDetails/Foods";
import Medicines from "./Components/Stocks/StockDetails/Medicines";
import UpdateFood from "./Components/Stocks/UpdateStock/UpdateFood";
import UpdateMedicine from "./Components/Stocks/UpdateStock/UpdateMedicine";

//Animal and Treatment Routes
import AnimalHome from "./Components/AnimalHealth/AnimalHome/AnimalHome";
import AddAnimal from "./Components/AnimalHealth/AddAnimal/AddAnimal";
import AnimalDetails from "./Components/AnimalHealth/AnimalDetails/AnimalDetails"
import UpdateAnimal from "./Components/AnimalHealth/UpdateAnimal/UpdateAnimal";
import AddTreatment from "./Components/AnimalHealth/AddTreatment/AddTreatment";
import TreatmentDetails from "./Components/AnimalHealth/TreatmentDetails/TreatmentDetails";
import UpdateTreatment from "./Components/AnimalHealth/UpdateTreatment/UpdateTreatment";

// Finance Routes
import FinanceHome from './Components/Finance/FinanceHome';
import Finance from './Components/Finance/Finance/Finance';
import AddFinance from './Components/Finance/AddFinance/AddFinance';
import FinanceDetails from './Components/Finance/FinanceDetails/FinanceDetails';
import UpdateFinance from './Components/Finance/UpdateFinance/UpdateFinance';
import IncomeDetails from './Components/Finance/FinanceDetails/IncomeDetails';

//Order Routes
import OrderHome from './Components/Orders/OrderHome';
import AddOrder from './Components/Orders/AddOrder/AddOrder';
import Orders from './Components/Orders/OrderDetails/Orders';
import ViewOrder from "./Components/Orders/ViewOrder/ViewOrder";
import UpdateOrder from "./Components/Orders/UpdateOrder/UpdateOrder";
import SupplierDetails from "./Components/Orders/SupplierDetails/SupplierDetails";

// Employee Routes
import EmployeeHome from './Components/Employees/EmployeeHome';
import AddEmployee from './Components/Employees/AddEmployee/AddEmployee';
import Employees from "./Components/Employees/EmployeeDetails/Employees";
import UpdateEmployee from "./Components/Employees/UpdateEmployee/UpdateEmployee";
import SalaryCalculation from './Components/Employees/EmployeeDetails/SalaryCalculation'; 
import SalariesPage from './Components/Employees/EmployeeDetails/Salaries';


function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/stockhome" element={<StockHome/>}/>
          <Route path="/addfood" element={<AddFood/>}/>
          <Route path="/addmedicine" element={<AddMedicine/>}/>
          <Route path="/fooddetails" element={<Foods/>}/>
          <Route path="/fooddetails/:id" element={<UpdateFood/>}/>
          <Route path="/medicinedetails" element={<Medicines/>}/>
          <Route path="/medicinedetails/:id" element={<UpdateMedicine/>}/>

          <Route path="/animalhome" element={<AnimalHome />} />
          <Route path="/addanimal" element={<AddAnimal />} />
          <Route path="/animaldetails" element={<AnimalDetails />} />
          <Route path="/animaldetails/:id" element={<UpdateAnimal />} />
          <Route path="/addtreatment" element={<AddTreatment />} />
          <Route path="/treatmentdetails" element={<TreatmentDetails />} />
          <Route path="/treatmentdetails/:id" element={<UpdateTreatment />} />

          <Route path="/financehome" element={<FinanceHome />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/addfinance" element={<AddFinance />} /> 
          <Route path="/financedetails" element={<FinanceDetails />} />
          <Route path="/incomedetails" element={<IncomeDetails />} />  
          <Route path="/updatefinance/:id" element={<UpdateFinance />} />


          <Route path="/orderhome" element={<OrderHome/>}/>
          <Route path="/addorder" element={<AddOrder/>}/>
          <Route path="/orderdetails" element={<Orders/>}/>
          <Route path="/vieworder" element={<ViewOrder/>}/>
          <Route path="/vieworder/:orderID" element={<UpdateOrder/>}/>
          <Route path="/supplierdetails" element={<SupplierDetails/>}/>

          <Route path="/" element={<EmployeeHome />} />
          <Route path="/employeehome" element={<EmployeeHome />} />
          <Route path="/addemployee" element={<AddEmployee />} />
          <Route path="/employeedetails" element={<Employees />} />
          <Route path="/updateemployeedetails/:id" element={<UpdateEmployee />} />
          <Route path="/salarycalculation/:nic" element={<SalaryCalculation />} />
          <Route path="/salaries" element={<SalariesPage />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
