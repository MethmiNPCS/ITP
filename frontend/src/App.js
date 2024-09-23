import React from "react";
import {Route, Routes} from "react-router";
import './App.css';
//import Home from './Components/Home/Home';
import StockHome from './Components/Stocks/StockHome';
import AddFood from './Components/Stocks/AddStock/AddFood';
import AddMedicine from "./Components/Stocks/AddStock/AddMedicine";
import Foods from "./Components/Stocks/StockDetails/Foods";
import Medicines from "./Components/Stocks/StockDetails/Medicines";
import UpdateFood from "./Components/Stocks/UpdateStock/UpdateFood";
import UpdateMedicine from "./Components/Stocks/UpdateStock/UpdateMedicine";

//Nadeeja
import FinanceHome from './Components/Finance/FinanceHome';
import Finance from './Components/Finance/Finance/Finance';
import AddFinance from './Components/Finance/AddFinance/AddFinance';
import FinanceDetails from './Components/Finance/FinanceDetails/FinanceDetails';
import UpdateFinance from './Components/Finance/UpdateFinance/UpdateFinance';
import IncomeDetails from './Components/Finance/FinanceDetails/IncomeDetails';
function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<StockHome/>}/>
          <Route path="/stockhome" element={<StockHome/>}/>
          <Route path="/addfood" element={<AddFood/>}/>
          <Route path="/addmedicine" element={<AddMedicine/>}/>
          <Route path="/fooddetails" element={<Foods/>}/>
          <Route path="/fooddetails/:id" element={<UpdateFood/>}/>
          <Route path="/medicinedetails" element={<Medicines/>}/>
          <Route path="/medicinedetails/:id" element={<UpdateMedicine/>}/>
          
          <Route path="/financehome" element={<FinanceHome />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/addfinance" element={<AddFinance />} /> 
          <Route path="/financedetails" element={<FinanceDetails />} />
          <Route path="/incomedetails" element={<IncomeDetails />} />  
          <Route path="/updatefinance/:id" element={<UpdateFinance />} />   
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
