/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Save, ImageIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AddProductPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 border border-border rounded-md hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-3xl font-heading text-foreground">Add New Product</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="px-4 py-2 border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors">
            Discard
          </Link>
          <button className="bg-foreground text-background px-6 py-2 text-sm font-medium rounded-md hover:bg-primary transition-colors flex items-center gap-2 shadow-sm">
            <Save className="w-4 h-4" /> Save Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading">General Information</CardTitle>
              <CardDescription>Basic details about the product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Aria Lounge Chair" className="focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description" 
                  rows={6}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe the product materials, design, and dimensions..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading">Media</CardTitle>
              <CardDescription>Upload product images. The first image will be the cover.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleImageChange}
                />
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </div>

              {/* URL Fallback */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">OR</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="space-y-2">
                <Label>Image URL (Fallback)</Label>
                <div className="flex gap-2">
                  <Input type="url" placeholder="https://example.com/image.jpg" className="flex-1 focus-visible:ring-primary" />
                  <button type="button" className="px-4 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">Add</button>
                </div>
              </div>

              {/* Image Preview Area */}
              {selectedImage && (
                <div className="mt-6">
                  <Label className="mb-2 block">Upload Preview</Label>
                  <div className="relative w-32 h-32 rounded-md border border-border overflow-hidden bg-muted group">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                  <option value="">Select Category...</option>
                  <option value="living-room">Living Room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="dining">Dining</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Sub-Category</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                  <option value="">Select Sub-Category...</option>
                  <option value="sofas">Sofas</option>
                  <option value="coffee-tables">Coffee Tables</option>
                  <option value="beds">Beds</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                  <option value="">Select Brand...</option>
                  <option value="lumen-exclusives">Lumen Exclusives</option>
                  <option value="nordic-living">Nordic Living</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading">Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" className="focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Price ($) <span className="text-muted-foreground font-normal text-xs">(Optional)</span></Label>
                <Input id="discount" type="number" min="0" step="0.01" placeholder="0.00" className="focus-visible:ring-primary" />
              </div>
              <div className="h-px bg-border my-2" />
              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                <Input id="sku" placeholder="e.g. LUM-SOF-001" className="focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Available Stock</Label>
                <Input id="stock" type="number" min="0" placeholder="0" className="focus-visible:ring-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
