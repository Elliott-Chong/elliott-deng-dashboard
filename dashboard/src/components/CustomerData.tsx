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
  const [attribute, setAttribute] = React.useState("Total_Purchases");
  const [limit, setLimit] = React.useState(10);
  const { data, isLoading } = useQuery({
    queryKey: ["mostPopularItems"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/customerData");
      return response.data;
    },
  });
  if (isLoading) return <></>;
  return (
    <div className="flex flex-col gap-3">
      <input
        min={1}
        max={data.length}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="number"
        placeholder="Limit"
        value={limit}
        onChange={(e) => setLimit(parseInt(e.target.value))}
      />
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
          setAttribute(e.target.value.split(" ").join("_").toUpperCase());
        }}
      >
        <option>Total Purchases</option>
        <option>Total Quantity Sold</option>
        <option>Total Spending</option>
        <option>Most Spent On Single Order</option>
        <option>Number of Orders</option>
        <option>Days Since Last Purchase</option>
      </select>
      <BarChart
        width={window.innerWidth * 0.9}
        height={250}
        data={data.slice(0, limit)}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"EMAIL"} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={attribute} fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default EmployeeSalesPerformance;
