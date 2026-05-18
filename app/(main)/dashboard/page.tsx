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
  item_id: number;
  item_name: string;
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
      const lowStockItems =
        stocks.filter(
          (item: any) =>
            item.stock > 0 &&
            item.stock < 5
        );

      setLowStock(
        lowStockItems.length
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

      {/* SUMMARY */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-sm text-slate-500">
            Total Items
          </div>

          <div className="mt-2 text-3xl font-bold">
            {stocks.length}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-sm text-slate-500">
            Total Stock
          </div>

          <div className="mt-2 text-3xl font-bold">
            {stocks.reduce(
              (acc, item) =>
                acc + item.stock,
              0
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-sm text-slate-500">
            Total Sales
          </div>

          <div className="mt-2 text-3xl font-bold">
            Rp{" "}
            {sales.reduce(
              (acc, item) =>
                acc + item.total_sales,
              0
            )}
          </div>
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
        <h2 className="mb-4 text-xl font-semibold">
          Current Stock
        </h2>

        <div className="space-y-2">
          {stocks.map((item) => (
            <div
              key={item.item_id}
              className="flex justify-between border-b pb-2"
            >
              <span>
                {item.item_name}
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