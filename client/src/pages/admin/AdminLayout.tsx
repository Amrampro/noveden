// client/src/pages/admin/AdminLayout.tsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "block px-4 py-3 rounded-lg transition",
      isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
    ].join(" ");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r">
        <div className="h-16 px-5 flex items-center border-b">
          <div className="font-semibold text-lg">Admin</div>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink to="/admin/product-categories" className={linkClass}>
            Catégory de produit
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
          <NavLink to="/admin/blog-categories" className={linkClass}>Blog categories</NavLink>
          <NavLink to="/admin/blog-posts" className={linkClass}>Blog posts</NavLink>
          <NavLink to="/admin/faqs" className={linkClass}>FAQs</NavLink>
          <NavLink to="/admin/banners" className={linkClass}>Banners</NavLink>
          <NavLink to="/admin/legal-links" className={linkClass}>Legal links</NavLink>
          <NavLink to="/admin/parameters" className={linkClass}>Parameters</NavLink>

        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <div className="font-medium text-gray-900">Dashboard</div>
          <div className="text-sm text-gray-600">Admin panel</div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
