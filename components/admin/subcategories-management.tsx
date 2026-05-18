"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type CategoryItem = {
  id: string;
  name: string;
};

type SubCategoryRow = {
  id: string;
  name: string;
  slug: string;
  parentCategory: string;
  categoryId: string;
  productCount: number;
  status: string;
};

export function SubCategoriesManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<SubCategoryRow[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    slug: "",
    status: "Active"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch subcategories
      const subRes = await fetch("/api/admin/subcategories");
      const subData = await subRes.json();
      if (subRes.ok) {
        setSubcategories(subData);
      }

      // Fetch categories for the parent selector
      const catRes = await fetch("/api/admin/categories");
      const catData = await catRes.json();
      if (catRes.ok) {
        setCategories(catData);
        if (catData.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: catData[0].id }));
        }
      }
    } catch (err) {
      console.error("Error fetching subcategories dependencies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          categoryId: formData.categoryId,
          slug: formData.slug || null,
        }),
      });

      if (response.ok) {
        await fetchData();
        setFormData((prev) => ({
          ...prev,
          name: "",
          slug: "",
          status: "Active"
        }));
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Error creating sub-category:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.parentCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Sub-Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage sub-divisions of your store's taxonomy.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="bg-foreground text-background px-4 py-2 text-sm font-medium rounded-md hover:bg-primary transition-colors flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Add Sub-Category
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-border bg-background">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Create Sub-Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Sub-Category Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Coffee Tables" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required 
                  className="focus-visible:ring-primary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Category</Label>
                <select 
                  id="parent" 
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (Optional)</Label>
                <Input 
                  id="slug" 
                  placeholder="e.g. coffee-tables" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="focus-visible:ring-primary border-border"
                />
              </div>
              <DialogFooter className="pt-4 gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-primary transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Sub-Category
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="relative flex-1 sm:w-64 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search sub-categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm border-border bg-transparent" 
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading sub-categories...</p>
          </div>
        ) : filteredSubcategories.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No sub-categories found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Sub-Category Name</th>
                  <th className="px-6 py-4 font-medium">Parent Category</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Products</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSubcategories.map(sub => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{sub.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{sub.parentCategory}</td>
                    <td className="px-6 py-4 text-muted-foreground">{sub.slug}</td>
                    <td className="px-6 py-4 text-foreground">{sub.productCount}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`font-normal rounded-md text-xs
                        ${sub.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}
                      `}>
                        {sub.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
