"use client";

import {
  useEffect,
  useState,
} from "react";

import { api } from "@/lib/api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

type Stock = {
  id: number;
  name: string;
  stock: number;
};

type Sales = {
  date: string;
  total_sales: number;
};

type TopSelling = {
  item_id: number;
  item_name: string;
  total_sold: number;
};

export default function DashboardPage() {
  const [stocks, setStocks] =
    useState<Stock[]>([]);

  const [sales, setSales] =
    useState<Sales[]>([]);

  const [topSelling, setTopSelling] =
    useState<TopSelling[]>([]);

  const [totalItems, setTotalItems] =
    useState(0);

  const [totalStock, setTotalStock] =
    useState(0);

  const [lowStock, setLowStock] =
    useState(0);

  const [todaySales, setTodaySales] =
    useState(0);

  const [lowStockItems, setLowStockItems] =
    useState<any[]>([]);

  const [recentSales, setRecentSales] =
    useState<any[]>([]);

  async function fetchDashboard() {
    try {
      const [
        stocksRes,
        salesRes,
        topSellingRes,
      ] = await Promise.all([
        api.get("/reports/stocks"),
        api.get("/reports/sales/daily"),
        api.get("/reports/top-selling"),
      ]);

      // existing state
      setStocks(stocksRes.data);

      setSales(salesRes.data);

      setRecentSales(
        salesRes.data.slice(0, 5)
      );

      setTopSelling(topSellingRes.data);

      // ===== METRICS =====

      const stocks =
        stocksRes.data;

      // total items
      setTotalItems(
        stocks.length
      );

      // total stock
      const totalStockQty =
        stocks.reduce(
          (
            acc: number,
            item: any
          ) =>
            acc +
            item.stock,
          0
        );

      setTotalStock(
        totalStockQty
      );

      // low stock
      const lowStockData =
        stocks.filter(
          (item: any) =>
            item.stock < 5
        );


      setLowStock(
        lowStockData.length
      );

      setLowStockItems(
        lowStockData
      );

      // today sales
      const dailySales =
        salesRes.data;

      const totalSales =
        dailySales.reduce(
          (
            acc: number,
            item: any
          ) =>
            acc +
            item.total_sales,
          0
        );

      setTodaySales(
        totalSales
      );

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Dashboard
      </h1>

      {/* SUMMARY CARD */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">

        {/* TOTAL ITEMS */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-sm text-slate-500">
            Total Items
          </div>

          <div className="mt-2 text-3xl font-bold">
            {totalItems}
          </div>
        </div>

        {/* TOTAL STOCK */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-sm text-slate-500">
            Total Stock
          </div>

          <div className="mt-2 text-3xl font-bold">
            {totalStock}
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-sm text-slate-500">
            Low Stock
          </div>

          <div className="mt-2 text-3xl font-bold text-yellow-500">
            {lowStock}
          </div>
        </div>

        {/* TODAY SALES */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-sm text-slate-500">
            Today Sales
          </div>

          <div className="mt-2 text-3xl font-bold text-green-600">
            Rp {todaySales}
          </div>
        </div>

      </div>

      {/* LOW STOCK */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow">

        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Low Stock Items
          </h2>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
            {lowStockItems.length} items
          </span>

        </div>

        {lowStockItems.length ===
          0 ? (
          <div className="text-slate-500">
            No low stock items
          </div>
        ) : (
          <div className="space-y-3">

            {lowStockItems.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border p-4"
                >

                  <div>
                    <div className="font-semibold">
                      {item.name}
                    </div>

                    <div className="text-sm text-slate-500">
                      SKU: {item.sku}
                    </div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-sm text-white ${item.stock === 0
                      ? "bg-red-500"
                      : "bg-yellow-500"
                      }`}
                  >
                    {item.stock}
                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

        {/* RECENT SALES */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow">

        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Recent Sales
          </h2>

          <span className="text-sm text-slate-500">
            Last 5 days
          </span>

        </div>

        <div className="space-y-3">

          {recentSales.map(
            (sale, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border p-4"
              >

                <div>
                  <div className="font-semibold">
                    {sale.date}
                  </div>

                  <div className="text-sm text-slate-500">
                    Daily Sales
                  </div>
                </div>

                <div className="font-bold text-green-600">
                  Rp{" "}
                  {sale.total_sales}
                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* SALES CHART */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Daily Sales
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={sales}>
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="total_sales"
                  stroke="#000"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP SELLING */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Top Selling
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={topSelling}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="item_name"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="total_sold"
                  fill="#000"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* STOCK TABLE */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Current Stock
        </h2>

        <div className="space-y-2">
          {stocks.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b pb-2"
            >
              <span>
                {item.name}
              </span>

              <span>
                {item.stock}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}