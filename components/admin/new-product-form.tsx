"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  UploadCloud, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCurrency } from "@/components/store/currency-context";

type TaxonomyItem = {
  id: string;
  name: string;
};

type SubCategoryItem = {
  id: string;
  name: string;
  categoryId: string;
};

interface NewProductFormProps {
  initialCategories: TaxonomyItem[];
  initialSubCategories: SubCategoryItem[];
  initialBrands: TaxonomyItem[];
}

type VariantInput = {
  color: string;
  material: string;
  stock: number;
  priceOffset: number;
};

export function NewProductForm({
  initialCategories,
  initialSubCategories,
  initialBrands,
}: NewProductFormProps) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();

  // Core product details state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [isEmiEligible, setIsEmiEligible] = useState(true);

  // Images state (max 3)
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Variants state (pre-populate with one default blank variant)
  const [variants, setVariants] = useState<VariantInput[]>([
    { color: "", material: "", stock: 10, priceOffset: 0 }
  ]);

  // Handle Category change to filter subcategories
  const filteredSubCategories = initialSubCategories.filter(
    (sub) => sub.categoryId === categoryId
  );

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setCategoryId(selected);
    setSubCategoryId(""); // Reset sub-category on parent category change
  };

  // Image Upload Action (Local file saving)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Check limit
    if (images.length >= 3) {
      setErrorMsg("Maximum of 3 product images allowed.");
      return;
    }

    setUploading(true);
    setErrorMsg("");

    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "File upload failed");
      }

      setImages((prev) => [...prev, data.url]);
      setSuccessMsg("Image uploaded successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong uploading the image.");
    } finally {
      setUploading(false);
    }
  };

  // Direct manual URL fallback image addition
  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    if (images.length >= 3) {
      setErrorMsg("Maximum of 3 product images allowed.");
      return;
    }

    setImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput("");
    setErrorMsg("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setErrorMsg("");
  };

  // Variant addition and manipulation handlers
  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { color: "", material: "", stock: 5, priceOffset: 0 }]);
  };

  const handleRemoveVariant = (indexToRemove: number) => {
    if (variants.length === 1) return; // Must keep at least one
    setVariants((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantInput,
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((v, idx) => (idx === index ? { ...v, [field]: value } : v))
    );
  };

  // Submit product registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !basePrice || !categoryId) {
      setErrorMsg("Please fill in all general details (Name, Description, Price, Category).");
      return;
    }

    if (images.length === 0) {
      setErrorMsg("Please add at least one product image (upload or URL fallback).");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        name,
        description,
        basePrice: parseFloat(basePrice),
        categoryId,
        subCategoryId: subCategoryId || null,
        brandId: brandId || null,
        isEmiEligible,
        images,
        variants: variants.map((v) => ({
          ...v,
          stock: parseInt(v.stock.toString(), 10) || 0,
          priceOffset: parseFloat(v.priceOffset.toString()) || 0,
        })),
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      setSuccessMsg("Product created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during submission.");
      setSubmitting(false);
    }
  };

  const isLimitReached = images.length >= 3;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top sticky-like Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 border border-border rounded-md hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>
          <div>
            <h1 className="text-3xl font-heading text-foreground">Add New Product</h1>
            <p className="text-sm text-muted-foreground">Define luxury inventory items with dynamic variants and media assets.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="px-4 py-2 border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors">
            Discard
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-foreground text-background px-6 py-2 text-sm font-medium rounded-md hover:bg-primary transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Notices */}
      {errorMsg && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-md flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-md flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Information Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-xl">General Information</CardTitle>
              <CardDescription>Enter the name, description, and accessibility settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Aria Lounge Chair"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="focus-visible:ring-primary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="flex w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  placeholder="Describe materials, build parameters, design heritage, dimensions..."
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="emi"
                  checked={isEmiEligible}
                  onChange={(e) => setIsEmiEligible(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <Label htmlFor="emi" className="font-medium cursor-pointer">
                  Eligible for Installment Plans (EMI)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Media & Images Upload (Enforcing Max 3 Images) */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-heading text-xl">Media Gallery</CardTitle>
                  <CardDescription>Upload local files or enter fallback URLs. Maximum 3 images total.</CardDescription>
                </div>
                <div className="text-xs font-semibold px-2 py-1 bg-muted rounded-md text-foreground">
                  {images.length}/3 Images
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Limit reached warning banner */}
              {isLimitReached && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-3 rounded-md flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>✨ Product media limit reached. Maximum of 3 images allowed. Remove an existing image to upload/add another.</span>
                </div>
              )}

              {/* Upload Dropzone */}
              <div 
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors relative
                  ${isLimitReached ? "border-muted bg-muted/20 opacity-50" : "border-border hover:bg-muted/30"}
                `}
              >
                <input
                  type="file"
                  accept="image/*"
                  disabled={isLimitReached || uploading}
                  className={`absolute inset-0 w-full h-full opacity-0 ${isLimitReached ? "cursor-not-allowed" : "cursor-pointer"}`}
                  onChange={handleFileUpload}
                />
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>
                <p className="text-sm font-medium">
                  {uploading ? "Uploading local image..." : "Click to upload local image or drag & drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Saves file directly to project path (max. 5MB)</p>
              </div>

              {/* URL fallback divider */}
              <div className="flex items-center gap-4">
                <div className="h-px bg-border flex-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">OR</span>
                <div className="h-px bg-border flex-1" />
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <Label>Image URL Fallback</Label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    disabled={isLimitReached}
                    placeholder={isLimitReached ? "Image limit reached" : "https://example.com/image.jpg"}
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 focus-visible:ring-primary border-border"
                  />
                  <button
                    type="button"
                    disabled={isLimitReached || !urlInput}
                    onClick={handleAddUrlImage}
                    className="px-4 bg-muted border border-border rounded-md text-sm font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Images Preview Area */}
              {images.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <Label className="mb-3 block text-sm font-semibold text-foreground">Media Previews ({images.length})</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-square rounded-md border border-border overflow-hidden bg-muted group shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 text-[10px] text-white rounded font-medium">
                          {idx === 0 ? "Cover" : `Image ${idx + 1}`}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 w-6 h-6 bg-white/95 text-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white shadow-md cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Variants Section */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-heading text-xl">Product Variants</CardTitle>
                <CardDescription>Define materials, custom colors, and individual stock counts.</CardDescription>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 border border-border text-foreground hover:bg-muted text-xs font-semibold rounded-md flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, idx) => (
                <div key={idx} className="p-4 border border-border rounded-md bg-muted/20 relative space-y-4">
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Variant #{idx + 1}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Color</Label>
                      <Input
                        type="text"
                        placeholder="e.g. Cream"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                        className="h-9 text-xs border-border bg-card"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Material</Label>
                      <Input
                        type="text"
                        placeholder="e.g. Italian Bouclé"
                        value={variant.material}
                        onChange={(e) => handleVariantChange(idx, "material", e.target.value)}
                        className="h-9 text-xs border-border bg-card"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Stock</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(idx, "stock", parseInt(e.target.value) || 0)}
                        className="h-9 text-xs border-border bg-card"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Price Offset ({currencySymbol})</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={variant.priceOffset}
                        onChange={(e) => handleVariantChange(idx, "priceOffset", parseFloat(e.target.value) || 0)}
                        className="h-9 text-xs border-border bg-card"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column (1/3) */}
        <div className="space-y-6">
          
          {/* Organization Selector Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Category Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={handleCategoryChange}
                  required
                  className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <option value="">Select Category...</option>
                  {initialCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Category Dropdown (Dependent & Chained) */}
              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub-Category</Label>
                <select
                  id="subCategory"
                  value={subCategoryId}
                  onChange={(e) => setSubCategoryId(e.target.value)}
                  disabled={!categoryId}
                  className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!categoryId
                      ? "Select category first..."
                      : filteredSubCategories.length === 0
                      ? "No sub-categories available..."
                      : "Select Sub-Category..."}
                  </option>
                  {filteredSubCategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <select
                  id="brand"
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <option value="">Select Brand...</option>
                  {initialBrands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Base Price ({currencySymbol})</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  required
                  className="focus-visible:ring-primary border-border"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
