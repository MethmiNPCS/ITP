import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Doughnut } from 'react-chartjs-2'; // Import Doughnut chart
import './Finance.css';

const IncomeURL = "http://localhost:5000/finance";
const ProductURL = "http://localhost:5000/products";
const SalaryURL = "http://localhost:5000/salaries";
const StockURL = "http://localhost:5000/stocks";

const fetchHandler = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

function ProfitAndLoss() {
  const [finance, setFinance] = useState([]);
  const [products, setProducts] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const financeData = await fetchHandler(IncomeURL);
      const productData = await fetchHandler(ProductURL);
      const salaryData = await fetchHandler(SalaryURL);
      const stockData = await fetchHandler(StockURL);

      if (financeData.finance) setFinance(financeData.finance);
      if (productData.products) setProducts(productData.products);
      if (salaryData.salaries) setSalaries(salaryData.salaries);
      if (stockData.stocks) setStocks(stockData.stocks);
    };

    fetchData();
  }, []);

  const totalIncome = () => {
    const incomeFinance = finance.filter(item => item.transactionType === 'Income');
    const totalFinanceIncome = incomeFinance.reduce((sum, item) => sum + item.amount, 0);
    const totalProductIncome = products.reduce((sum, product) => sum + (product.Totalprice || 0), 0);
    return totalFinanceIncome + totalProductIncome;
  };

  const totalExpenses = () => {
    const expenseFinance = finance.filter(item => item.transactionType === 'Expense');
    const totalFinanceExpenses = expenseFinance.reduce((sum, item) => sum + item.amount, 0);
    const totalSalaryExpenses = salaries.reduce((sum, salary) => sum + salary.totalSalary, 0);
    const totalStockExpenses = stocks.reduce((sum, stock) => sum + stock.totalPrice, 0);
    return totalFinanceExpenses + totalSalaryExpenses + totalStockExpenses;
  };

  const profitOrLoss = totalIncome() - totalExpenses();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Profit and Loss Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['Total Income', 'Total Expenses', 'Profit / Loss']],
      body: [[
        `Rs. ${totalIncome().toLocaleString()}`,
        `Rs. ${totalExpenses().toLocaleString()}`,
        `Rs. ${profitOrLoss.toLocaleString()}`
      ]]
    });
    doc.save('profit-loss-report.pdf');
  };

  // Donut chart data
  const data = {
    labels: ['Total Income', 'Total Expenses'],
    datasets: [
      {
        data: [totalIncome(), totalExpenses()],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#1E90FF', '#FF4C4C'],
      },
    ],
  };

  return (
    <div>
      <Nav />
      <center>
        <h1 className="I-h1">Profit and Loss Statement</h1>
      </center>

      <div className="PI-table-wrapper">
        <table className="fp-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Income</td>
              <td>{totalIncome().toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total Expenses</td>
              <td>{totalExpenses().toLocaleString()}</td>
            </tr>
            <tr>
              <td>{profitOrLoss >= 0 ? "Net Profit" : "Net Loss"}</td>
              <td>{profitOrLoss.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="f-pie">
        <Doughnut data={data} />
      </div>

      <center>
        <button className="I-generate-report" onClick={generatePDF}>Generate PDF Report</button>
      </center>
    </div>
  );
}

export default ProfitAndLoss;
