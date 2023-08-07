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
  const [attribute, setAttribute] = React.useState(
    "Estimated_Out_Of_Stock_Date"
  );
  const [limit, setLimit] = React.useState(10);
  const { data, isLoading } = useQuery({
    queryKey: ["inventoryData"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/inventoryData");
      return response.data;
    },
  });
  console.log("data", data);
  const formattedData = React.useMemo(() => {
    if (!data) return [];
    let meow = data.map((item) => {
      const Estimated_Out_Of_Stock_Date = new Date(
        item.Estimated_Out_Of_Stock_Date
      );

      const days_delta =
        (Estimated_Out_Of_Stock_Date.getTime() - new Date().getTime()) /
        (1000 * 3600 * 24);
      return {
        ...item,
        Estimated_Out_Of_Stock_Date: Math.round(days_delta),
      };
    });
    meow = meow.sort((b, a) => {
      return a[attribute] - b[attribute];
    });
    return meow;
  }, [data, attribute]);
  if (isLoading) return <></>;
  return (
    <div className="flex flex-col gap-3">
      <input
        min={1}
        max={formattedData.length}
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
        <option>Inventory Turnover Ratio</option>
        <option>Days In Stock</option>
        <option>Estimated Out Of Stock Date</option>
      </select>
      <BarChart
        width={window.innerWidth * 0.9}
        height={250}
        data={formattedData.slice(0, limit)}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"PRODUCT_NAME"} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={attribute} fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default EmployeeSalesPerformance;
