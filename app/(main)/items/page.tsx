"use client";

import {
    useEffect,
    useState,
} from "react";

import { api } from "@/lib/api";

import { toast } from "sonner";

type Item = {
    id: number;
    name: string;
    sku: string;
    price_sell: number;
    price_buy: number;
};

export default function ItemsPage() {
    const [items, setItems] =
        useState<Item[]>([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [editingID, setEditingID] =
        useState<number | null>(null);

    const [form, setForm] = useState({
        name: "",
        sku: "",
        price_sell: "",
        price_buy: "",
    });

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

    async function createItem() {
        try {
            setLoading(true);

            await api.post("/items", {
                name: form.name,
                sku: form.sku,
                price_sell: Number(
                    form.price_sell
                ),
                price_buy: Number(
                    form.price_buy
                ),
            });

            toast.success(
                "Item created"
            );

            resetForm();

            fetchItems();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.error ||
                "Create failed"
            );
        } finally {
            setLoading(false);
        }
    }

    async function updateItem() {
        try {
            setLoading(true);

            await api.put(
                `/items/${editingID}`,
                {
                    name: form.name,
                    sku: form.sku,
                    price_sell: Number(
                        form.price_sell
                    ),
                    price_buy: Number(
                        form.price_buy
                    ),
                }
            );

            toast.success(
                "Item updated"
            );

            resetForm();

            fetchItems();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.error ||
                "Update failed"
            );
        } finally {
            setLoading(false);
        }
    }

    async function deleteItem(
        id: number
    ) {
        const confirmed = confirm(
            "Delete this item?"
        );

        if (!confirmed) return;

        try {
            await api.delete(
                `/items/${id}`
            );

            toast.success(
                "Item deleted"
            );

            fetchItems();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.error ||
                "Delete failed"
            );
        }
    }

    function handleEdit(item: Item) {
        toast.success("Edit mode");

        setEditingID(item.id);

        setForm({
            name: item.name,
            sku: item.sku,
            price_sell:
                item.price_sell.toString(),
            price_buy:
                item.price_buy.toString(),
        });

        // scroll ke atas biar form langsung kelihatan
        window.scrollTo(0, 0);
    }

    function resetForm() {
        setEditingID(null);

        setForm({
            name: "",
            sku: "",
            price_sell: "",
            price_buy: "",
        });
    }

    const filteredItems = items.filter(
        (item) =>
            item.name.toLowerCase().includes(
                search.toLowerCase()
            ) ||
            item.sku.toLowerCase().includes(
                search.toLowerCase()
            )
    );

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">
                Items
            </h1>

            {/* FORM */}
            <div className="mb-6 rounded-2xl bg-white p-6 shadow">

                <h2 className="mb-4 text-xl font-semibold">
                    {editingID
                        ? "Edit Item"
                        : "Add Item"}
                </h2>

                <div className="grid gap-4 md:grid-cols-2">

                    {/* NAME */}
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name:
                                    e.target.value,
                            })
                        }
                        className="rounded-xl border p-3"
                    />

                    {/* SKU */}
                    <input
                        type="text"
                        placeholder="SKU"
                        value={form.sku}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                sku:
                                    e.target.value,
                            })
                        }
                        className="rounded-xl border p-3"
                    />

                    {/* PRICE SELL */}
                    <input
                        type="number"
                        placeholder="Price Sell"
                        value={form.price_sell}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                price_sell:
                                    e.target.value,
                            })
                        }
                        className="rounded-xl border p-3"
                    />

                    {/* PRICE BUY */}
                    <input
                        type="number"
                        placeholder="Price Buy"
                        value={form.price_buy}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                price_buy:
                                    e.target.value,
                            })
                        }
                        className="rounded-xl border p-3"
                    />
                </div>

                <div className="mt-4 flex gap-3">

                    <button
                        onClick={() => {
                            if (editingID) {
                                updateItem();
                            } else {
                                createItem();
                            }
                        }}
                        disabled={loading}
                        className="rounded-xl bg-black px-6 py-3 text-white"
                    >
                        {loading
                            ? editingID
                                ? "Updating..."
                                : "Creating..."
                            : editingID
                                ? "Update Item"
                                : "Create Item"}
                    </button>

                    {editingID && (
                        <button
                            onClick={resetForm}
                            className="rounded-xl border px-6 py-3"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* SEARCH */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search item..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="w-full rounded-xl border bg-white p-3"
                />
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-2xl bg-white shadow">

                <table className="w-full">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-4 text-left">
                                Name
                            </th>

                            <th className="p-4 text-left">
                                SKU
                            </th>

                            <th className="p-4 text-left">
                                Price Sell
                            </th>

                            <th className="p-4 text-left">
                                Price Buy
                            </th>

                            <th className="p-4 text-left">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredItems.map(
                            (item) => (
                                <tr
                                    key={item.id}
                                    className="border-t"
                                >
                                    <td className="p-4">
                                        {item.name}
                                    </td>

                                    <td className="p-4">
                                        {item.sku}
                                    </td>

                                    <td className="p-4">
                                        Rp{" "}
                                        {
                                            item.price_sell
                                        }
                                    </td>

                                    <td className="p-4">
                                        Rp{" "}
                                        {
                                            item.price_buy
                                        }
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-2">

                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        item
                                                    )
                                                }
                                                className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteItem(
                                                        item.id
                                                    )
                                                }
                                                className="rounded-lg bg-red-500 px-4 py-2 text-white"
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            )
                        )}

                        {filteredItems.length ===
                            0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-8 text-center text-slate-500"
                                    >
                                        No items found
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>

            </div>
        </div>
    );
}