const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());

const sqlConfig = {
  user: "SA",
  password: "Password123",
  database: "CompAccInc_DWTeam1",
  server: "localhost",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};
app.get("/employeeSalesPerformance", async (req, res) => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    const result = await sql.query`

    SELECT
    DE.EMPLOYEE_ID AS Employee_ID,
    DE.FIRST_NAME + ' ' + DE.LAST_NAME AS Employee_Name,
    SUM(FS.QUANTITY_SOLD) AS Total_Sales_Quantity,
    COUNT(DISTINCT FS.ORDER_KEY) AS Total_Transactions,
    CAST(SUM(FS.QUANTITY_SOLD * FS.UNIT_PRICE) AS DECIMAL(9, 2)) AS Revenue_Generated,
    ROUND(AVG(SUM(FS.QUANTITY_SOLD * FS.UNIT_PRICE)) OVER (), 2) AS Average_Revenue,
    CAST(SUM(FS.QUANTITY_SOLD * FS.UNIT_PRICE) - AVG(SUM(FS.QUANTITY_SOLD * FS.UNIT_PRICE)) OVER () AS DECIMAL(9, 2)) AS Revenue_Variance,
    CAST(SUM(FS.PROFIT) AS DECIMAL(9, 2)) AS Profit_Generated,
    ROUND(AVG(SUM(FS.PROFIT)) OVER (), 2) AS Average_Profit,
    CAST(SUM(FS.PROFIT) - AVG(SUM(FS.PROFIT)) OVER () AS DECIMAL(9, 2)) AS Profit_Variance,
    DATEDIFF(YEAR, DE.HIRE_DATE, GETDATE()) AS Years_Hired
FROM
    DIM_EMPLOYEE DE
    JOIN
    FACT_SALES FS ON DE.EMPLOYEE_KEY = FS.EMPLOYEE_KEY
WHERE DE.JOB_TITLE = 'Sales Representative'
GROUP BY
    DE.EMPLOYEE_ID,
    DE.FIRST_NAME,
    DE.LAST_NAME,
    DE.HIRE_DATE
ORDER BY
    Profit_Generated DESC,
    Revenue_Generated DESC;
    `;
    return res.json(result.recordset);
  } catch (err) {
    // ... error checks
    return res.status(400);
  }
});

app.get("/trendInTimeSeries", async (req, res) => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    const result = await sql.query`
    SELECT
    SD.Sales_Year,
    SD.Sales_Month,
    SD.Total_Sales_Quantity,
    SD.Revenue_Generated,
    SD.Profit_Generated,
    SD.Total_Sales_Quantity - A.Avg_Total_Sales AS Sales_Variance_to_Average,
    SD.Revenue_Generated - A.Avg_Revenue AS Revenue_Variance_to_Average,
    SD.Profit_Generated - A.Avg_Profit AS Profit_Variance_to_Average
FROM (
    SELECT
        DATEPART(YEAR, TIME_ID) AS Sales_Year,
        DATEPART(MONTH, TIME_ID) AS Sales_Month,
        SUM(QUANTITY_SOLD) AS Total_Sales_Quantity,
        SUM(QUANTITY_SOLD * UNIT_PRICE) AS Revenue_Generated,
        SUM(PROFIT) AS Profit_Generated
    FROM
        DIM_TIME DT
        JOIN
        FACT_SALES FS ON DT.TIME_KEY = FS.TIME_KEY
    GROUP BY
        DATEPART(YEAR, TIME_ID),
        DATEPART(MONTH, TIME_ID)
) SD
CROSS JOIN (
    SELECT
        AVG(Total_Sales_Quantity) AS Avg_Total_Sales,
        AVG(Revenue_Generated) AS Avg_Revenue,
        AVG(Profit_Generated) AS Avg_Profit
    FROM (
        SELECT
            DATEPART(YEAR, TIME_ID) AS Sales_Year,
            DATEPART(MONTH, TIME_ID) AS Sales_Month,
            SUM(QUANTITY_SOLD) AS Total_Sales_Quantity,
            SUM(QUANTITY_SOLD * UNIT_PRICE) AS Revenue_Generated,
            SUM(PROFIT) AS Profit_Generated
        FROM
            DIM_TIME DT
            JOIN
            FACT_SALES FS ON DT.TIME_KEY = FS.TIME_KEY
        GROUP BY
            DATEPART(YEAR, TIME_ID),
            DATEPART(MONTH, TIME_ID)
    ) AS SalesData
) A
ORDER BY
    SD.Sales_Year, SD.Sales_Month;

      `;
    return res.json(result.recordset);
  } catch (err) {
    // ... error checks
    return res.status(400);
  }
});

app.get("/mostPopularItems", async (req, res) => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    const result = await sql.query`
      SELECT dp.PRODUCT_NAME,
    COUNT(do.ORDER_ID) AS ORDER_COUNT,
    SUM(fs.PROFIT) AS TOTAL_PROFIT,
    CAST(SUM(fs.QUANTITY_SOLD * fs.UNIT_PRICE)AS DECIMAL(20,2)) AS TOTAL_SALES,
    ((SUM(fs.PROFIT) / SUM(fs.QUANTITY_SOLD * fs.UNIT_PRICE)) * 100) AS PROFIT_MARGIN
FROM FACT_SALES fs
    JOIN DIM_PRODUCT dp ON fs.PRODUCT_KEY = dp.PRODUCT_KEY
    JOIN DIM_ORDER do ON fs.ORDER_KEY = do.ORDER_KEY
GROUP BY dp.PRODUCT_NAME
ORDER BY ORDER_COUNT DESC;

        `;
    return res.json(result.recordset);
  } catch (err) {
    // ... error checks
    return res.status(400);
  }
});

app.get("/customerData", async (req, res) => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    const result = await sql.query`
    SELECT
    C.CUSTOMER_KEY,
    C.FIRST_NAME,
    C.LAST_NAME,
    C.EMAIL,
    COUNT(DISTINCT FS.ORDER_KEY) AS Total_Purchases,
    SUM(FS.QUANTITY_SOLD) AS Total_Quantity_Sold,
    SUM(FS.QUANTITY_SOLD * FS.UNIT_PRICE) AS Total_Spending,
    MAX(FS.QUANTITY_SOLD * FS.UNIT_PRICE) AS Most_Spent_On_Single_Order,
    COUNT(DISTINCT FS.ORDER_KEY) AS Number_of_Orders,
    MAX(O.ORDER_DATE) AS Last_Purchase_Date,
    DATEDIFF(DAY, MAX(O.ORDER_DATE), GETDATE()) AS Days_Since_Last_Purchase
FROM
    DIM_CUSTOMER C
    JOIN
    FACT_SALES FS ON C.CUSTOMER_KEY = FS.CUSTOMER_KEY
    JOIN
    DIM_ORDER O ON FS.ORDER_KEY = O.ORDER_KEY
GROUP BY
    C.CUSTOMER_KEY,
    C.FIRST_NAME,
    C.LAST_NAME,
    C.EMAIL;

      `;
    return res.json(result.recordset);
  } catch (err) {
    // ... error checks
    return res.status(400);
  }
});

app.get("/inventoryData", async (req, res) => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    const result = await sql.query`
 SELECT
    D.PRODUCT_ID,
    D.PRODUCT_NAME,
    ISNULL(T.Inventory_Turnover_Ratio, 0) AS Inventory_Turnover_Ratio,
    ISNULL(T.Days_In_Stock, 0) AS Days_In_Stock,
    COALESCE(T.Estimated_Out_Of_Stock_Date, CONVERT(VARCHAR(10), GETDATE(), 101)) AS Estimated_Out_Of_Stock_Date
FROM (
    SELECT 
        P.PRODUCT_ID,
        MAX(P.PRODUCT_KEY) AS MAX_PRODUCT_KEY
    FROM DIM_PRODUCT P
    GROUP BY P.PRODUCT_ID
) AS MAX_KEYS
JOIN DIM_PRODUCT D ON D.PRODUCT_ID = MAX_KEYS.PRODUCT_ID AND D.PRODUCT_KEY = MAX_KEYS.MAX_PRODUCT_KEY
JOIN (
    SELECT
        COGS_PER_PRODUCT.PRODUCT_ID,
        COGS_PER_PRODUCT.TOTAL_QUANTITY_SOLD,
        AVG_INV_PER_PRODUCT.AVERAGE_INVENTORY_QUANTITY,
        CASE
            WHEN AVG_INV_PER_PRODUCT.AVERAGE_INVENTORY_QUANTITY = 0 THEN NULL
            ELSE CAST(COGS_PER_PRODUCT.TOTAL_QUANTITY_SOLD / AVG_INV_PER_PRODUCT.AVERAGE_INVENTORY_QUANTITY AS DECIMAL(8, 2))
        END AS Inventory_Turnover_Ratio,
        CASE
            WHEN COGS_PER_PRODUCT.TOTAL_QUANTITY_SOLD = 0 THEN NULL
            ELSE CAST(AVG_INV_PER_PRODUCT.AVERAGE_INVENTORY_QUANTITY / COGS_PER_PRODUCT.TOTAL_QUANTITY_SOLD AS DECIMAL(8, 2))
        END AS Days_In_Stock,
        CASE
            WHEN COGS_PER_PRODUCT.TOTAL_QUANTITY_SOLD = 0 THEN NULL
            ELSE CONVERT(VARCHAR(10), DATEADD(DAY, CAST(AVG_INV_PER_PRODUCT.AVERAGE_INVENTORY_QUANTITY / COGS_PER_PRODUCT.TOTAL_QUANTITY_SOLD AS INT), GETDATE()), 101)
        END AS Estimated_Out_Of_Stock_Date
    FROM (
        SELECT 
            P.PRODUCT_ID,
            COALESCE(SUM(FS.QUANTITY_SOLD), 0) AS TOTAL_QUANTITY_SOLD
        FROM DIM_PRODUCT P
        LEFT JOIN FACT_SALES FS ON FS.PRODUCT_KEY = P.PRODUCT_KEY
        GROUP BY P.PRODUCT_ID
    ) AS COGS_PER_PRODUCT
    JOIN (
        SELECT 
            PRODUCT_ID,
            CAST(ISNULL(AVG(STOCK_QUANTITY), 0) AS DECIMAL(8, 2)) AS AVERAGE_INVENTORY_QUANTITY
        FROM DIM_PRODUCT
        GROUP BY PRODUCT_ID
    ) AS AVG_INV_PER_PRODUCT
    ON COGS_PER_PRODUCT.PRODUCT_ID = AVG_INV_PER_PRODUCT.PRODUCT_ID
) AS T ON T.PRODUCT_ID = D.PRODUCT_ID; 
        `;
    return res.json(result.recordset);
  } catch (err) {
    // ... error checks
    return res.status(400);
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
