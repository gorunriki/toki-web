"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import { api } from "@/lib/api";

type Item = {
  id: number;
  name: string;
};

type CartItem = {
  item_id: number;
  name: string;
  qty: number;
  price_buy: number;
};

export default function InboundPage() {
  const [items, setItems] =
    useState<Item[]>([]);

  const [selectedItem, setSelectedItem] =
    useState("");

  const [qty, setQty] =
    useState("");

  const [priceBuy, setPriceBuy] =
    useState("");

  const [note, setNote] =
    useState("");

  const [cart, setCart] = useState<
    CartItem[]
  >([]);

  async function fetchItems() {
    try {
      const res = await api.get("/items");

      setItems(res.data);
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to fetch items"
      );
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function addItem() {
    if (
      !selectedItem ||
      !qty ||
      !priceBuy
    ) {
      toast.error(
        "Please complete all fields"
      );

      return;
    }

    const item = items.find(
      (i) =>
        i.id === Number(selectedItem)
    );

    if (!item) {
      toast.error("Item not found");

      return;
    }

    const existing = cart.find(
      (c) => c.item_id === item.id
    );

    if (existing) {
      setCart((prev) =>
        prev.map((c) =>
          c.item_id === item.id
            ? {
                ...c,
                qty:
                  c.qty +
                  Number(qty),
              }
            : c
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          item_id: item.id,
          name: item.name,
          qty: Number(qty),
          price_buy:
            Number(priceBuy),
        },
      ]);
    }

    setSelectedItem("");
    setQty("");
    setPriceBuy("");

    toast.success("Item added");
  }

  function removeItem(
    itemID: number
  ) {
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.item_id !== itemID
      )
    );

    toast.success("Item removed");
  }

  async function submitInbound() {
    try {
      await api.post("/inbounds", {
        note,
        created_by: 1,
        items: cart,
      });

      toast.success(
        "Inbound success 🔥"
      );

      setCart([]);
      setNote("");
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data?.error ||
          "Inbound failed"
      );
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Inbound / Restock
      </h1>

      {/* FORM */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow">

        <div className="grid gap-4 md:grid-cols-4">

          {/* ITEM */}
          <select
            value={selectedItem}
            onChange={(e) =>
              setSelectedItem(
                e.target.value
              )
            }
            className="rounded-xl border p-3"
          >
            <option value="">
              Select Item
            </option>

            {items.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>

          {/* QTY */}
          <input
            type="number"
            placeholder="Qty"
            value={qty}
            onChange={(e) =>
              setQty(e.target.value)
            }
            className="rounded-xl border p-3"
          />

          {/* PRICE BUY */}
          <input
            type="number"
            placeholder="Buy Price"
            value={priceBuy}
            onChange={(e) =>
              setPriceBuy(
                e.target.value
              )
            }
            className="rounded-xl border p-3"
          />

          {/* BUTTON */}
          <button
            type="button"
            onClick={addItem}
            className="rounded-xl bg-black px-4 py-3 text-white"
          >
            Add Item
          </button>
        </div>

        {/* NOTE */}
        <textarea
          placeholder="Note..."
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          className="mt-4 w-full rounded-xl border p-3"
        />
      </div>

      {/* CART */}
      <div className="rounded-2xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-semibold">
          Restock Items
        </h2>

        {cart.length === 0 && (
          <div className="text-slate-500">
            No items added
          </div>
        )}

        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.item_id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <div className="font-semibold">
                  {item.name}
                </div>

                <div className="text-sm text-slate-500">
                  Qty: {item.qty}
                </div>

                <div className="text-sm text-slate-500">
                  Buy Price: Rp{" "}
                  {item.price_buy}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  removeItem(
                    item.item_id
                  )
                }
                className="rounded-lg bg-red-500 px-3 py-2 text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={submitInbound}
          className="mt-6 w-full rounded-xl bg-green-600 p-4 text-white disabled:bg-slate-300"
        >
          Submit Inbound
        </button>
      </div>
    </div>
  );
}