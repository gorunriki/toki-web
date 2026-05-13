"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stocks, setStocks] = useState([]);
  const [sales, setSales] = useState([]);
  const [topSelling, setTopSelling] = useState([]);

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

      setStocks(stocksRes.data);
      setSales(salesRes.data);
      setTopSelling(topSellingRes.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="mb-6 text-3xl font-bold">
        TOKI Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3">

        {/* STOCK */}
        <div className="rounded-2xl bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Current Stock
          </h2>

          <div className="space-y-2">
            {stocks.slice(0, 5).map((item: any) => (
              <div
                key={item.item_id}
                className="flex justify-between border-b pb-2"
              >
                <span>{item.item_name}</span>
                <span>{item.stock}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DAILY SALES */}
        <div className="rounded-2xl bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Daily Sales
          </h2>

          <div className="space-y-2">
            {sales.map((item: any) => (
              <div
                key={item.date}
                className="flex justify-between border-b pb-2"
              >
                <span>{item.date}</span>
                <span>Rp {item.total_sales}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TOP SELLING */}
        <div className="rounded-2xl bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Top Selling
          </h2>

          <div className="space-y-2">
            {topSelling.map((item: any) => (
              <div
                key={item.item_id}
                className="flex justify-between border-b pb-2"
              >
                <span>{item.item_name}</span>
                <span>{item.total_sold}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}