import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const EmployeeSalesPerformance = () => {
  const [attribute, setAttribute] = React.useState("Total_Sales_Quantity");
  const { data, isLoading } = useQuery({
    queryKey: ["EmployeeSalesPerformance"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5000/employeeSalesPerformance"
      );
      return response.data;
    },
  });
  if (isLoading) return <></>;
  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="select"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Select An Option
      </label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        id="select"
        onChange={(e) => {
          setAttribute(e.target.value.split(" ").join("_"));
        }}
      >
        <option>Total Sales Quantity</option>
        <option>Total Transactions</option>
        <option>Revenue Generated</option>
        <option>Average Revenue</option>
        <option>Revenue Variance</option>
        <option>Profit Generated</option>
        <option>Average Profit</option>
        <option>Profit Variance</option>
        <option>Years Hired</option>
      </select>
      <BarChart width={window.innerWidth * 0.9} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"Employee_Name"} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={attribute} fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default EmployeeSalesPerformance;
