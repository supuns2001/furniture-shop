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

export function BrandsManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [brands, setBrands] = useState([
    { id: "BRD-01", name: "Lumen Exclusives", slug: "lumen-exclusives", productCount: 120, status: "Active" },
    { id: "BRD-02", name: "Nordic Living", slug: "nordic-living", productCount: 45, status: "Active" },
    { id: "BRD-03", name: "Artisan Woodworks", slug: "artisan-woodworks", productCount: 12, status: "Active" },
    { id: "BRD-04", name: "Modern Light", slug: "modern-light", productCount: 38, status: "Active" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    status: "Active"
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newBrand = {
      id: `BRD-0${brands.length + 1}`,
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      productCount: 0,
      status: formData.status
    };
    setBrands([...brands, newBrand]);
    setFormData({ name: "", slug: "", status: "Active" });
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading text-foreground">Brands</h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="bg-foreground text-background px-4 py-2 text-sm font-medium rounded-md hover:bg-primary transition-colors flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Add Brand
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-border bg-background">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Create Brand</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Nordic Living" 
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
                  placeholder="e.g. nordic-living" 
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
                  Save Brand
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
            <Input placeholder="Search brands..." className="pl-9 h-9 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Brand Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Products</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {brands.map(brand => (
                <tr key={brand.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{brand.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{brand.slug}</td>
                  <td className="px-6 py-4">{brand.productCount}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`font-normal rounded-md text-xs
                      ${brand.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}
                    `}>
                      {brand.status}
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
