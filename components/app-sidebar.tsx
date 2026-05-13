"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const menus = [
    {
        name: "Dashboard",
        href: "/dashboard",
    },
    {
        name: "POS",
        href: "/pos",
    },
    {
        name: "Items",
        href: "/items",
    },
    {
        name: "Inbounds",
        href: "/inbounds",
    },
];

export default function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem("token");

        router.push("/login");
    }

    return (
        <div className="sticky top-0 flex min-h-screen w-64 flex-col border-r bg-white shadow-sm">

            {/* LOGO */}
            <div className="border-b p-6">
                <h1 className="text-2xl font-bold">
                    TOKI WMS
                </h1>
            </div>

            {/* MENU */}
            <div className="flex-1 p-4">
                <div className="space-y-2">

                    {menus.map((menu) => {
                        const active =
                            pathname === menu.href;

                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className={`block rounded-xl px-4 py-3 transition ${active
                                    ? "bg-black text-white"
                                    : "hover:bg-slate-100"
                                    }`}
                            >
                                {menu.name}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* FOOTER */}
            <div className="border-t p-4">

                <button
                    onClick={handleLogout}
                    className="w-full rounded-xl bg-red-500 px-4 py-2 text-white"
                >
                    Logout
                </button>

                <div className="mt-3 text-center text-sm text-slate-500">
                    TOKI WMS v1
                </div>
            </div>
        </div>
    );
}

