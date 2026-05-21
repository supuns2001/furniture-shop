"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/components/store/currency-context";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CategoriesManagement } from "./categories-management";
import { SubCategoriesManagement } from "./subcategories-management";
import { BrandsManagement } from "./brands-management";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
};

export function ProductsManagement() {
  const { formatPrice } = useCurrency();
  const [catalogTab, setCatalogTab] = useState("products");
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to retrieve products");
      }
      setProducts(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (catalogTab === "products") {
      fetchProducts();
    }
  }, [catalogTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this luxury product? This will remove all its images and variants from the database.")) return;

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "An error occurred deleting the product.");
    }
  };

  // Filter products by search term and status tabs
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    if (activeTab === "active") return p.status === "Active";
    if (activeTab === "low_stock") return p.status === "Low Stock";
    if (activeTab === "out_of_stock") return p.status === "Out of Stock";
    return true;
  });

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
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCatalogTab(tab.id)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap px-1 cursor-pointer ${
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
            <Link href="/admin/products/new" className="bg-foreground text-background px-4 py-2 text-sm font-medium rounded-md hover:bg-primary transition-colors flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>

          <div className="bg-card border border-border rounded-md shadow-sm">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                {["all", "active", "low_stock", "out_of_stock"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap capitalize cursor-pointer ${
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
                  <Input 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-sm border-border bg-transparent" 
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Loading luxury catalog items...</p>
              </div>
            ) : errorMsg ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-destructive">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm">{errorMsg}</p>
                <button onClick={fetchProducts} className="text-xs underline text-primary mt-2">Try Again</button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No products found.
              </div>
            ) : (
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
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          {product.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md border border-border" />
                          )}
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{product.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground">{product.category}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4 text-foreground">{product.stock}</td>
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
                            <Link 
                              href={`/admin/products/${product.id}/edit`}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {catalogTab === "categories" && <CategoriesManagement />}
      {catalogTab === "subcategories" && <SubCategoriesManagement />}
      {catalogTab === "brands" && <BrandsManagement />}
    </div>
  );
}
