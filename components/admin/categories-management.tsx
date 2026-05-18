"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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

export function CategoriesManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([
    { id: "CAT-01", name: "Living Room", slug: "living-room", productCount: 45, status: "Active" },
    { id: "CAT-02", name: "Bedroom", slug: "bedroom", productCount: 32, status: "Active" },
    { id: "CAT-03", name: "Dining", slug: "dining", productCount: 18, status: "Active" },
    { id: "CAT-04", name: "Lighting", slug: "lighting", productCount: 56, status: "Active" },
    { id: "CAT-05", name: "Outdoor", slug: "outdoor", productCount: 0, status: "Draft" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    status: "Active"
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory = {
      id: `CAT-0${categories.length + 1}`,
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      productCount: 0,
      status: formData.status
    };
    setCategories([...categories, newCategory]);
    setFormData({ name: "", slug: "", status: "Active" });
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading text-foreground">Categories</h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="bg-foreground text-background px-4 py-2 text-sm font-medium rounded-md hover:bg-primary transition-colors flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Add Category
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-border bg-background">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Create Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Living Room" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required 
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (Optional)</Label>
                <Input 
                  id="slug" 
                  placeholder="e.g. living-room" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
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
                  className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-primary transition-colors cursor-pointer"
                >
                  Save Category
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
            <Input placeholder="Search categories..." className="pl-9 h-9 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Category Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Products</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map(category => (
                <tr key={category.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{category.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{category.slug}</td>
                  <td className="px-6 py-4">{category.productCount}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`font-normal rounded-md text-xs
                      ${category.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}
                    `}>
                      {category.status}
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
  );
}
