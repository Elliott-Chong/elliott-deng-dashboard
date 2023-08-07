import React from "react";
import EmployeeSalesPerformance from "./components/EmployeeSalesPerformance";
import InventoryData from "./components/InventoryData";
import CustomerData from "./components/CustomerData";
import MostPopularItems from "./components/MostPopularItems";
import TrendInTimeSeries from "./components/TrendInTimeSeries";

const activeStyle =
  "inline-block p-4 cursor-pointer text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500";
const inactiveStyle =
  "inline-block cursor-pointer p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";

const App = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <span
              onClick={() => {
                setActiveTab(0);
              }}
              className={activeTab === 0 ? activeStyle : inactiveStyle}
            >
              Employee Sales Performance
            </span>
          </li>
          <li className="mr-2">
            <span
              onClick={() => {
                setActiveTab(1);
              }}
              className={activeTab === 1 ? activeStyle : inactiveStyle}
              aria-current="page"
            >
              Trend in Time Series of Sales
            </span>
          </li>
          <li className="mr-2">
            <span
              onClick={() => {
                setActiveTab(2);
              }}
              className={activeTab === 2 ? activeStyle : inactiveStyle}
            >
              Most Popular Items and Sales Volume
            </span>
          </li>
          <li className="mr-2">
            <span
              onClick={() => {
                setActiveTab(3);
              }}
              className={activeTab === 3 ? activeStyle : inactiveStyle}
            >
              Customer Data
            </span>
          </li>
          <li className="mr-2">
            <span
              onClick={() => {
                setActiveTab(4);
              }}
              className={activeTab === 4 ? activeStyle : inactiveStyle}
            >
              Inventory Data
            </span>
          </li>
        </ul>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {activeTab == 0 && <EmployeeSalesPerformance />}
        {activeTab == 1 && <TrendInTimeSeries />}
        {activeTab == 2 && <MostPopularItems />}
        {activeTab == 3 && <CustomerData />}
        {activeTab == 4 && <InventoryData />}
      </div>
    </>
  );
};

export default App;
