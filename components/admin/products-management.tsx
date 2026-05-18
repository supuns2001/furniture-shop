"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CategoriesManagement } from "./categories-management";
import { SubCategoriesManagement } from "./subcategories-management";
import { BrandsManagement } from "./brands-management";

export function ProductsManagement() {
  const [catalogTab, setCatalogTab] = useState("products");
  const [activeTab, setActiveTab] = useState("all");

  const products = [
    { id: "PROD-001", name: "Aria Lounge Chair", category: "Living Room", price: 1250, stock: 45, status: "Active" },
    { id: "PROD-002", name: "Nordic Minimalist Sofa", category: "Living Room", price: 3400, stock: 12, status: "Active" },
    { id: "PROD-003", name: "Walnut Dining Table", category: "Dining", price: 2800, stock: 0, status: "Out of Stock" },
    { id: "PROD-004", name: "Ceramic Table Lamp", category: "Lighting", price: 450, stock: 124, status: "Active" },
    { id: "PROD-005", name: "Velvet Accent Chair", category: "Living Room", price: 890, stock: 5, status: "Low Stock" },
  ];

  return (
    <div className="space-y-6">
      {/* Header section with page title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your luxury product inventory, taxonomy, and brand registry.</p>
        </div>
      </div>

      {/* Catalog Level Tabs */}
      <div className="border-b border-border flex gap-4 overflow-x-auto hide-scrollbar">
        {[
          { id: "products", label: "Products" },
          { id: "categories", label: "Categories" },
          { id: "subcategories", label: "Sub-Categories" },
          { id: "brands", label: "Brands" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCatalogTab(tab.id)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap px-1 ${
              catalogTab === tab.id
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Tab Render */}
      {catalogTab === "products" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Link href="/admin/products/new" className="bg-foreground text-background px-4 py-2 text-sm font-medium rounded-md hover:bg-primary transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>

          <div className="bg-card border border-border rounded-md shadow-sm">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                {["all", "active", "draft", "out_of_stock"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap capitalize ${
                      activeTab === tab 
                        ? "bg-muted text-foreground" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {tab.replace("_", " ")}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-9 h-9 text-sm" />
                </div>
                <button className="p-2 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{product.id}</p>
                      </td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4 font-medium">${product.price.toLocaleString()}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`font-normal rounded-md text-xs
                          ${product.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${product.status === 'Out of Stock' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                          ${product.status === 'Low Stock' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                        `}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {catalogTab === "categories" && <CategoriesManagement />}
      {catalogTab === "subcategories" && <SubCategoriesManagement />}
      {catalogTab === "brands" && <BrandsManagement />}
    </div>
  );
}
