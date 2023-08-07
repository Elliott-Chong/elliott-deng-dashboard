import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const EmployeeSalesPerformance = () => {
  const [attribute, setAttribute] = React.useState("Total_Sales_Quantity");
  const [year, setYear] = React.useState(2017);
  const { data, isLoading } = useQuery({
    queryKey: ["trendInTimeSeries"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5000/trendInTimeSeries"
      );
      return response.data;
    },
  });
  const formatted = React.useMemo(() => {
    if (!data) return [];
    return data.filter((d) => d.Sales_Year === year);
  }, [data, year]);
  if (isLoading) return <></>;
  return (
    <div className="flex flex-col gap-3">
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        id="year"
        onChange={(e) => {
          setYear(parseInt(e.target.value));
        }}
      >
        <option>2016</option>
        <option>2017</option>
        <option>2018</option>
        <option>2019</option>
      </select>
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
        <option>Profit Generated</option>
        <option>Sales Variance to Average</option>
        <option>Revenue Variance to Average</option>
        <option>Profit Variance to Average</option>
      </select>
      <LineChart
        width={window.innerWidth * 0.9}
        height={250}
        data={formatted}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Sales_Month" label={"Month"} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={attribute} stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default EmployeeSalesPerformance;
