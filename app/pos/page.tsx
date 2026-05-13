"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

type Item = {
  item_id: number;
  item_name: string;
  price_sell: number;
  stock: number;
};

type CartItem = {
  item_id: number;
  name: string;
  qty: number;
  price_sell: number;
};

export default function POSPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  async function fetchItems() {
    try {
      const res = await api.get("/reports/stocks");

      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function addToCart(item: Item) {
    if (item.stock <= 0) {
      alert("Stock habis");
      return;
    }

    const existing = cart.find(
      (c) => c.item_id === item.item_id
    );

    if (existing) {
      if (existing.qty >= item.stock) {
        alert("Stock tidak cukup");
        return;
      }

      setCart((prev) =>
        prev.map((c) =>
          c.item_id === item.item_id
            ? {
                ...c,
                qty: c.qty + 1,
              }
            : c
        )
      );

      return;
    }

    setCart((prev) => [
      ...prev,
      {
        item_id: item.item_id,
        name: item.item_name,
        qty: 1,
        price_sell: item.price_sell,
      },
    ]);
  }

  function increaseQty(itemID: number) {
    const itemData = items.find(
      (i) => i.item_id === itemID
    );

    const cartItem = cart.find(
      (c) => c.item_id === itemID
    );

    if (!itemData || !cartItem) return;

    if (cartItem.qty >= itemData.stock) {
      alert("Stock tidak cukup");
      return;
    }

    setCart((prev) =>
      prev.map((c) =>
        c.item_id === itemID
          ? {
              ...c,
              qty: c.qty + 1,
            }
          : c
      )
    );
  }

  function decreaseQty(itemID: number) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.item_id === itemID
            ? {
                ...c,
                qty: c.qty - 1,
              }
            : c
        )
        .filter((c) => c.qty > 0)
    );
  }

  const total = cart.reduce(
    (acc, item) =>
      acc + item.qty * item.price_sell,
    0
  );

  async function checkout() {
    try {
      await api.post("/sales", {
        customer_name: "Walk In Customer",
        total_amount: total,
        created_by: 1,
        items: cart.map((item) => ({
          item_id: item.item_id,
          qty: item.qty,
          price_sell: item.price_sell,
        })),
      });

      alert("Checkout success 🔥");

      setCart([]);

      fetchItems();
    } catch (err: any) {
      alert(
        err?.response?.data?.error ||
          "checkout failed"
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="mb-6 text-3xl font-bold">
        POS
      </h1>

      <div className="grid gap-6 md:grid-cols-2">

        {/* ITEMS */}
        <div className="rounded-2xl bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Items
          </h2>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.item_id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="font-semibold">
                    {item.item_name}
                  </div>

                  <div className="text-sm text-slate-500">
                    Rp {item.price_sell}
                  </div>

                  <div
                    className={`text-sm font-medium ${
                      item.stock <= 5
                        ? "text-red-500"
                        : "text-blue-600"
                    }`}
                  >
                    Stock: {item.stock}
                  </div>
                </div>

                <button
                  onClick={() =>
                    addToCart(item)
                  }
                  disabled={item.stock <= 0}
                  className="rounded-lg bg-black px-4 py-2 text-white disabled:bg-slate-300"
                >
                  {item.stock <= 0
                    ? "Out"
                    : "Add"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CART */}
        <div className="rounded-2xl bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Cart
          </h2>

          <div className="space-y-3">
            {cart.length === 0 && (
              <div className="text-slate-500">
                Cart kosong
              </div>
            )}

            {cart.map((item) => (
              <div
                key={item.item_id}
                className="rounded-lg border p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      {item.name}
                    </div>

                    <div className="text-sm text-slate-500">
                      Rp {item.price_sell}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        decreaseQty(item.item_id)
                      }
                      className="rounded bg-slate-200 px-2"
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        increaseQty(item.item_id)
                      }
                      className="rounded bg-slate-200 px-2"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-right text-sm text-slate-500">
                  Subtotal: Rp{" "}
                  {item.qty * item.price_sell}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="mb-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>Rp {total}</span>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={checkout}
              className="w-full rounded-xl bg-green-600 p-3 text-white disabled:bg-slate-300"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}