/**
 * demo-data.ts
 * -----------
 * Static in-memory mock data used when DEMO_MODE=true.
 * Data mirrors prisma/seed.ts exactly so the UI looks identical
 * to a freshly-seeded real database.
 */

// ─── IDs (stable UUIDs for cross-entity references) ───────────────────────
const ID = {
  // Brands
  brandNordic: "b-nordic-001",
  brandArtisan: "b-artisan-002",
  brandLumen: "b-lumen-003",
  brandVelvet: "b-velvet-004",
  brandModern: "b-modern-005",

  // Categories
  catLiving: "c-living-001",
  catBedroom: "c-bedroom-002",
  catDining: "c-dining-003",
  catLighting: "c-lighting-004",

  // Sub-categories
  subSofas: "sc-sofas-001",
  subLoungeChairs: "sc-lounge-002",
  subCoffeeTables: "sc-coffee-003",
  subBeds: "sc-beds-004",
  subNightstands: "sc-night-005",
  subWardrobes: "sc-ward-006",
  subDiningTables: "sc-diningtable-007",
  subDiningChairs: "sc-diningchair-008",
  subCabinets: "sc-cabinet-009",
  subChandeliers: "sc-chandelier-010",
  subTableLamps: "sc-tablelamp-011",
  subFloorLamps: "sc-floorlamp-012",

  // Users / customers
  userAdmin: "u-admin-001",
  userLiam: "u-liam-001",
  userEmma: "u-emma-002",
  userNoah: "u-noah-003",
  userOlivia: "u-olivia-004",

  // Products (first 10 shown for brevity, all 20 included)
  p01: "prod-aria-lounge-01",
  p02: "prod-nordic-sofa-02",
  p03: "prod-marble-table-03",
  p04: "prod-boucle-sofa-04",
  p05: "prod-tuscan-arm-05",
  p06: "prod-canopy-bed-06",
  p07: "prod-monarch-night-07",
  p08: "prod-oak-wardrobe-08",
  p09: "prod-japan-bed-09",
  p10: "prod-artdeco-dress-10",
  p11: "prod-walnut-table-11",
  p12: "prod-imperial-chair-12",
  p13: "prod-travertine-cred-13",
  p14: "prod-walnut-sidebar-14",
  p15: "prod-metro-dining-15",
  p16: "prod-ceramic-lamp-16",
  p17: "prod-constellation-17",
  p18: "prod-aura-brass-18",
  p19: "prod-celestial-pend-19",
  p20: "prod-warm-bed-lamp-20",
};

const NOW = new Date();
const daysAgo = (n: number) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() - n);
  return d;
};
const daysFromNow = (n: number) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() + n);
  return d;
};

// ─── BRANDS ───────────────────────────────────────────────────────────────
export const demoBrands = [
  { id: ID.brandNordic, name: "Nordic Living", slug: "nordic-living", description: "Minimalist Scandinavian designs focusing on warmth, light, and natural timber.", productCount: 6 },
  { id: ID.brandArtisan, name: "Artisan Woodworks", slug: "artisan-woodworks", description: "Bespoke, handcrafted solid wood masterpieces crafted by legacy carpenters.", productCount: 7 },
  { id: ID.brandLumen, name: "Lumen Exclusives", slug: "lumen-exclusives", description: "Avant-garde architectural lighting designed to transform space and atmosphere.", productCount: 3 },
  { id: ID.brandVelvet, name: "Velvet & Co.", slug: "velvet-and-co", description: "Ultra-luxurious upholstered furniture clad in the world's finest premium fabrics.", productCount: 3 },
  { id: ID.brandModern, name: "Modern Light", slug: "modern-light", description: "Contemporary and functional minimalist lighting fixtures.", productCount: 2 },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────
export const demoCategories = [
  { id: ID.catLiving, name: "Living Room", slug: "living-room", productCount: 5, status: "Active" },
  { id: ID.catBedroom, name: "Bedroom", slug: "bedroom", productCount: 5, status: "Active" },
  { id: ID.catDining, name: "Dining Room", slug: "dining-room", productCount: 5, status: "Active" },
  { id: ID.catLighting, name: "Lighting", slug: "lighting", productCount: 5, status: "Active" },
];

export const demoSubcategories = [
  { id: ID.subSofas, name: "Sofas", slug: "sofas", categoryId: ID.catLiving },
  { id: ID.subLoungeChairs, name: "Lounge Chairs", slug: "lounge-chairs", categoryId: ID.catLiving },
  { id: ID.subCoffeeTables, name: "Coffee Tables", slug: "coffee-tables", categoryId: ID.catLiving },
  { id: ID.subBeds, name: "Beds", slug: "beds", categoryId: ID.catBedroom },
  { id: ID.subNightstands, name: "Nightstands", slug: "nightstands", categoryId: ID.catBedroom },
  { id: ID.subWardrobes, name: "Wardrobes", slug: "wardrobes", categoryId: ID.catBedroom },
  { id: ID.subDiningTables, name: "Dining Tables", slug: "dining-tables", categoryId: ID.catDining },
  { id: ID.subDiningChairs, name: "Dining Chairs", slug: "dining-chairs", categoryId: ID.catDining },
  { id: ID.subCabinets, name: "Cabinets", slug: "cabinets", categoryId: ID.catDining },
  { id: ID.subChandeliers, name: "Chandeliers", slug: "chandeliers", categoryId: ID.catLighting },
  { id: ID.subTableLamps, name: "Table Lamps", slug: "table-lamps", categoryId: ID.catLighting },
  { id: ID.subFloorLamps, name: "Floor Lamps", slug: "floor-lamps", categoryId: ID.catLighting },
];

// ─── PRODUCTS (all 20) ────────────────────────────────────────────────────
export const demoProducts = [
  // --- LIVING ROOM ---
  {
    id: ID.p01, name: "Aria Lounge Chair", slug: "aria-lounge-chair",
    description: "A signature lounging masterpiece wrapped in premium, high-pile cream bouclé. Supported by an organic matte black steel structure, this chair provides a deep, plush seating experience that naturally hugs the contours of the body.",
    basePrice: 1250, categoryId: ID.catLiving, subCategoryId: ID.subLoungeChairs, brandId: ID.brandVelvet, isEmiEligible: true,
    category: { name: "Living Room" }, brand: { name: "Velvet & Co." },
    images: [
      { url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800" },
      { url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800" },
    ],
    variants: [
      { id: "v-p01-1", color: "Cream Bouclé", material: "Bouclé Fabric & Steel", size: "Standard", stock: 15, priceOffset: 0 },
      { id: "v-p01-2", color: "Charcoal Grey", material: "Wool Blend & Steel", size: "Standard", stock: 10, priceOffset: 120 },
    ],
    stock: 25, status: "Active", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800",
    price: 1250, createdAt: daysAgo(30), updatedAt: daysAgo(2),
  },
  {
    id: ID.p02, name: "Nordic Minimalist Sofa", slug: "nordic-minimalist-sofa",
    description: "Crafted with clean lines and absolute proportions, the Nordic Modular Sofa offers unparalleled comfort. Features a solid kiln-dried pine frame, high-density foam padding with feather filling.",
    basePrice: 3400, categoryId: ID.catLiving, subCategoryId: ID.subSofas, brandId: ID.brandNordic, isEmiEligible: true,
    category: { name: "Living Room" }, brand: { name: "Nordic Living" },
    images: [
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" },
      { url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=800" },
    ],
    variants: [
      { id: "v-p02-1", color: "Sand Linen", material: "Linen & Pine Wood", size: "3-Seater", stock: 8, priceOffset: 0 },
      { id: "v-p02-2", color: "Warm Grey Linen", material: "Linen & Pine Wood", size: "4-Seater", stock: 5, priceOffset: 450 },
    ],
    stock: 13, status: "Active", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
    price: 3400, createdAt: daysAgo(25), updatedAt: daysAgo(3),
  },
  {
    id: ID.p03, name: "Fluted Marble Coffee Table", slug: "fluted-marble-coffee-table",
    description: "An architectural center-piece crafted from solid Arabescato marble. Features a beautifully fluted cylindrical base and a polished circular top with naturally rich, dark veining.",
    basePrice: 1850, categoryId: ID.catLiving, subCategoryId: ID.subCoffeeTables, brandId: ID.brandNordic, isEmiEligible: true,
    category: { name: "Living Room" }, brand: { name: "Nordic Living" },
    images: [{ url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p03-1", color: "Arabescato White", material: "Solid Marble", size: "90cm Diameter", stock: 12, priceOffset: 0 }],
    stock: 12, status: "Active", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800",
    price: 1850, createdAt: daysAgo(20), updatedAt: daysAgo(1),
  },
  {
    id: ID.p04, name: "Bespoke Bouclé Sofa", slug: "bespoke-boucle-sofa",
    description: "Indulging curvilinear shapes define the Bespoke Sofa. Clad entirely in high-end ivory bouclé fabric, its continuous low profile structure rests on a hidden recessed base.",
    basePrice: 5200, categoryId: ID.catLiving, subCategoryId: ID.subSofas, brandId: ID.brandVelvet, isEmiEligible: true,
    category: { name: "Living Room" }, brand: { name: "Velvet & Co." },
    images: [{ url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p04-1", color: "Ivory", material: "Bouclé & Hardwood", size: "Curved 4-Seater", stock: 4, priceOffset: 0 }],
    stock: 4, status: "Low Stock", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
    price: 5200, createdAt: daysAgo(18), updatedAt: daysAgo(4),
  },
  {
    id: ID.p05, name: "Tuscan Leather Armchair", slug: "tuscan-leather-armchair",
    description: "A heritage leather armchair constructed using hand-dyed Italian full-grain cognac leather. The warm-toned timber legs and stitched leather detailing highlight its exceptional luxury credentials.",
    basePrice: 2100, categoryId: ID.catLiving, subCategoryId: ID.subLoungeChairs, brandId: ID.brandVelvet, isEmiEligible: true,
    category: { name: "Living Room" }, brand: { name: "Velvet & Co." },
    images: [{ url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p05-1", color: "Cognac Brown", material: "Italian Leather & Walnut", size: "Standard", stock: 6, priceOffset: 0 }],
    stock: 6, status: "Active", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800",
    price: 2100, createdAt: daysAgo(15), updatedAt: daysAgo(5),
  },
  // --- BEDROOM ---
  {
    id: ID.p06, name: "Elysian Canopy Bed", slug: "elysian-canopy-bed",
    description: "An elegant structural canopy bed made of deep American walnut. Includes a cushioned, tufted headboard in textured natural linen.",
    basePrice: 4800, categoryId: ID.catBedroom, subCategoryId: ID.subBeds, brandId: ID.brandArtisan, isEmiEligible: true,
    category: { name: "Bedroom" }, brand: { name: "Artisan Woodworks" },
    images: [
      { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800" },
      { url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800" },
    ],
    variants: [
      { id: "v-p06-1", color: "Natural Walnut", material: "Walnut & Linen", size: "King Size", stock: 5, priceOffset: 0 },
      { id: "v-p06-2", color: "Natural Walnut", material: "Walnut & Linen", size: "Queen Size", stock: 7, priceOffset: -400 },
    ],
    stock: 12, status: "Active", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
    price: 4800, createdAt: daysAgo(40), updatedAt: daysAgo(6),
  },
  {
    id: ID.p07, name: "Monarch Nightstand", slug: "monarch-nightstand",
    description: "Matching the Elysian range, the Monarch features soft-close drawers clad in premium woven cane, perfectly offset by a dark walnut frame and elegant brass drawer pulls.",
    basePrice: 750, categoryId: ID.catBedroom, subCategoryId: ID.subNightstands, brandId: ID.brandArtisan, isEmiEligible: true,
    category: { name: "Bedroom" }, brand: { name: "Artisan Woodworks" },
    images: [{ url: "https://images.unsplash.com/photo-1532372320978-9b4d8a3a0245?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p07-1", color: "Natural Walnut", material: "Walnut & French Cane", size: "Standard", stock: 24, priceOffset: 0 }],
    stock: 24, status: "Active", image: "https://images.unsplash.com/photo-1532372320978-9b4d8a3a0245?auto=format&fit=crop&q=80&w=800",
    price: 750, createdAt: daysAgo(35), updatedAt: daysAgo(7),
  },
  {
    id: ID.p08, name: "Minimalist Oak Wardrobe", slug: "minimalist-oak-wardrobe",
    description: "A large floor-to-ceiling wardrobe constructed of light white oak. Features seamless integrated handles, soft-close hinges, and extensive internal customization options.",
    basePrice: 3200, categoryId: ID.catBedroom, subCategoryId: ID.subWardrobes, brandId: ID.brandNordic, isEmiEligible: true,
    category: { name: "Bedroom" }, brand: { name: "Nordic Living" },
    images: [{ url: "https://images.unsplash.com/photo-1558882224-cca16673336d?auto=format&fit=crop&q=80&w=800" }],
    variants: [
      { id: "v-p08-1", color: "White Oak", material: "Solid Oak", size: "Double Cabinet", stock: 3, priceOffset: 0 },
      { id: "v-p08-2", color: "White Oak", material: "Solid Oak", size: "Triple Cabinet", stock: 2, priceOffset: 950 },
    ],
    stock: 5, status: "Low Stock", image: "https://images.unsplash.com/photo-1558882224-cca16673336d?auto=format&fit=crop&q=80&w=800",
    price: 3200, createdAt: daysAgo(28), updatedAt: daysAgo(8),
  },
  {
    id: ID.p09, name: "Japanese Oak Bed Frame", slug: "japanese-oak-bed-frame",
    description: "Deeply low-profile platform bed referencing warm Japanese minimalism. Features exceptionally wide side ledges, solid joint details, and a floating base look.",
    basePrice: 3600, categoryId: ID.catBedroom, subCategoryId: ID.subBeds, brandId: ID.brandNordic, isEmiEligible: true,
    category: { name: "Bedroom" }, brand: { name: "Nordic Living" },
    images: [{ url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p09-1", color: "Natural Oak", material: "Oak Wood", size: "King Size", stock: 9, priceOffset: 0 }],
    stock: 9, status: "Active", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    price: 3600, createdAt: daysAgo(22), updatedAt: daysAgo(9),
  },
  {
    id: ID.p10, name: "Art Deco Dressing Table", slug: "art-deco-dressing-table",
    description: "A gorgeous dressing table finished in a dark ash timber veneer, accented with circular bronze mirrors and soft velvet-lined drawers.",
    basePrice: 2450, categoryId: ID.catBedroom, subCategoryId: ID.subNightstands, brandId: ID.brandVelvet, isEmiEligible: true,
    category: { name: "Bedroom" }, brand: { name: "Velvet & Co." },
    images: [{ url: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p10-1", color: "Ebonized Ash & Bronze", material: "Ash Wood & Mirror", size: "Standard", stock: 6, priceOffset: 0 }],
    stock: 6, status: "Active", image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800",
    price: 2450, createdAt: daysAgo(19), updatedAt: daysAgo(10),
  },
  // --- DINING ROOM ---
  {
    id: ID.p11, name: "Walnut Dining Table", slug: "walnut-dining-table",
    description: "A massive, gorgeous dining table featuring an expansive 2.4-meter solid walnut plank top with raw organic live edges, resting on two bold brushed brass pedestals.",
    basePrice: 2800, categoryId: ID.catDining, subCategoryId: ID.subDiningTables, brandId: ID.brandArtisan, isEmiEligible: true,
    category: { name: "Dining Room" }, brand: { name: "Artisan Woodworks" },
    images: [{ url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800" }],
    variants: [
      { id: "v-p11-1", color: "Natural Walnut", material: "Solid Walnut & Brass", size: "2.4 Meters", stock: 5, priceOffset: 0 },
      { id: "v-p11-2", color: "Natural Walnut", material: "Solid Walnut & Brass", size: "3.0 Meters", stock: 3, priceOffset: 600 },
    ],
    stock: 8, status: "Active", image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800",
    price: 2800, createdAt: daysAgo(33), updatedAt: daysAgo(11),
  },
  {
    id: ID.p12, name: "Imperial Dining Chair", slug: "imperial-dining-chair",
    description: "A highly comfortable dining chair showcasing curved bentwood oak construction, completed with a premium cushioned seat pad upholstered in rich charcoal boucle.",
    basePrice: 680, categoryId: ID.catDining, subCategoryId: ID.subDiningChairs, brandId: ID.brandArtisan, isEmiEligible: false,
    category: { name: "Dining Room" }, brand: { name: "Artisan Woodworks" },
    images: [{ url: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p12-1", color: "Charcoal & Bentwood", material: "Oak Wood & Bouclé", size: "Standard", stock: 40, priceOffset: 0 }],
    stock: 40, status: "Active", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800",
    price: 680, createdAt: daysAgo(45), updatedAt: daysAgo(12),
  },
  {
    id: ID.p13, name: "Travertine Credenza", slug: "travertine-credenza",
    description: "A stunning statement credenza clad entirely in cream-toned Roman travertine stone. Features three cupboards with internal timber shelves.",
    basePrice: 3900, categoryId: ID.catDining, subCategoryId: ID.subCabinets, brandId: ID.brandNordic, isEmiEligible: true,
    category: { name: "Dining Room" }, brand: { name: "Nordic Living" },
    images: [{ url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p13-1", color: "Honed Travertine", material: "Travertine Stone", size: "180cm Width", stock: 4, priceOffset: 0 }],
    stock: 4, status: "Low Stock", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
    price: 3900, createdAt: daysAgo(50), updatedAt: daysAgo(13),
  },
  {
    id: ID.p14, name: "Sleek Walnut Sideboard", slug: "sleek-walnut-sideboard",
    description: "Constructed of high-quality American Walnut, this sideboard has beautiful slatted sliding doors that elegantly conceal internal glass shelving.",
    basePrice: 2600, categoryId: ID.catDining, subCategoryId: ID.subCabinets, brandId: ID.brandArtisan, isEmiEligible: true,
    category: { name: "Dining Room" }, brand: { name: "Artisan Woodworks" },
    images: [{ url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p14-1", color: "Natural Walnut", material: "Walnut Wood & Glass", size: "160cm Width", stock: 8, priceOffset: 0 }],
    stock: 8, status: "Active", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
    price: 2600, createdAt: daysAgo(42), updatedAt: daysAgo(14),
  },
  {
    id: ID.p15, name: "Metropolitan Dining Set", slug: "metropolitan-dining-set",
    description: "A fully curated dining experience. Includes our 2.4-meter Walnut dining table and a set of six Imperial dining chairs at a bundled luxurious value.",
    basePrice: 6200, categoryId: ID.catDining, subCategoryId: ID.subDiningTables, brandId: ID.brandArtisan, isEmiEligible: true,
    category: { name: "Dining Room" }, brand: { name: "Artisan Woodworks" },
    images: [{ url: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p15-1", color: "Natural Walnut & Charcoal", material: "Walnut, Oak, & Fabric", size: "Standard Set", stock: 3, priceOffset: 0 }],
    stock: 3, status: "Low Stock", image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800",
    price: 6200, createdAt: daysAgo(60), updatedAt: daysAgo(15),
  },
  // --- LIGHTING ---
  {
    id: ID.p16, name: "Ceramic Table Lamp", slug: "ceramic-table-lamp",
    description: "A gorgeous sculptural table lamp. The base is crafted from hand-thrown white ceramic with a textured, tactile sand glaze. Topped with a custom textured beige linen drum shade.",
    basePrice: 450, categoryId: ID.catLighting, subCategoryId: ID.subTableLamps, brandId: ID.brandLumen, isEmiEligible: false,
    category: { name: "Lighting" }, brand: { name: "Lumen Exclusives" },
    images: [{ url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p16-1", color: "Glazed Sand Ceramic", material: "Ceramic & Linen", size: "55cm Height", stock: 85, priceOffset: 0 }],
    stock: 85, status: "Active", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    price: 450, createdAt: daysAgo(70), updatedAt: daysAgo(16),
  },
  {
    id: ID.p17, name: "Constellation Chandelier", slug: "constellation-chandelier",
    description: "An architectural masterpiece. Features twelve hand-blown glass globes mounted on a brushed solid brass structure. Emits a stunning ambient glow.",
    basePrice: 6500, categoryId: ID.catLighting, subCategoryId: ID.subChandeliers, brandId: ID.brandLumen, isEmiEligible: true,
    category: { name: "Lighting" }, brand: { name: "Lumen Exclusives" },
    images: [{ url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p17-1", color: "Brushed Solid Brass", material: "Brass & Hand-Blown Glass", size: "120cm Diameter", stock: 2, priceOffset: 0 }],
    stock: 2, status: "Low Stock", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
    price: 6500, createdAt: daysAgo(55), updatedAt: daysAgo(17),
  },
  {
    id: ID.p18, name: "Aura Brass Floor Lamp", slug: "aura-brass-floor-lamp",
    description: "An elegant, towering floor lamp made of polished raw brass. Includes an adjustable arched neck and heavy marble base weight to guarantee perfect stability.",
    basePrice: 950, categoryId: ID.catLighting, subCategoryId: ID.subFloorLamps, brandId: ID.brandModern, isEmiEligible: true,
    category: { name: "Lighting" }, brand: { name: "Modern Light" },
    images: [{ url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p18-1", color: "Polished Brass & Marble", material: "Brass & Marble", size: "180cm Height", stock: 15, priceOffset: 0 }],
    stock: 15, status: "Active", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
    price: 950, createdAt: daysAgo(48), updatedAt: daysAgo(18),
  },
  {
    id: ID.p19, name: "Celestial Pendant Light", slug: "celestial-pendant-light",
    description: "A single drop sculptural pendant light with a fluted ceramic shade. Perfect for lining above kitchen islands or high-end bar spaces.",
    basePrice: 1400, categoryId: ID.catLighting, subCategoryId: ID.subChandeliers, brandId: ID.brandModern, isEmiEligible: true,
    category: { name: "Lighting" }, brand: { name: "Modern Light" },
    images: [{ url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p19-1", color: "Fluted Ceramic White", material: "Ceramic & Brass", size: "30cm Diameter", stock: 18, priceOffset: 0 }],
    stock: 18, status: "Active", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    price: 1400, createdAt: daysAgo(38), updatedAt: daysAgo(19),
  },
  {
    id: ID.p20, name: "Warm Ambience Bed Lamp", slug: "warm-ambience-bed-lamp",
    description: "A small, elegant bedside lamp with a heavy black travertine block base and a glowing spherical frosted glass bulb.",
    basePrice: 380, categoryId: ID.catLighting, subCategoryId: ID.subTableLamps, brandId: ID.brandLumen, isEmiEligible: false,
    category: { name: "Lighting" }, brand: { name: "Lumen Exclusives" },
    images: [{ url: "https://images.unsplash.com/photo-1542728928-1413d1894ed1?auto=format&fit=crop&q=80&w=800" }],
    variants: [{ id: "v-p20-1", color: "Matte Black Travertine", material: "Travertine & Glass", size: "30cm Height", stock: 45, priceOffset: 0 }],
    stock: 45, status: "Active", image: "https://images.unsplash.com/photo-1542728928-1413d1894ed1?auto=format&fit=crop&q=80&w=800",
    price: 380, createdAt: daysAgo(62), updatedAt: daysAgo(20),
  },
];

// ─── CUSTOMERS ────────────────────────────────────────────────────────────
export const demoCustomers = [
  {
    id: ID.userLiam, name: "Liam Johnson", email: "liam@example.com",
    orders: 3, spent: 8250, lastOrder: "Jun 12, 2026", status: "Active",
    createdAt: daysAgo(60).toISOString(),
    addresses: [{ id: "addr-liam-1", street: "128 Luxury Ave", city: "Colombo", state: "Western", zipCode: "00700", country: "Sri Lanka", isDefault: true }],
    ordersList: [
      { id: "ord-liam-1", totalAmount: 3400, status: "DELIVERED", createdAt: daysAgo(6).toISOString(), paymentMethod: "FULL_PAYMENT" },
      { id: "ord-liam-2", totalAmount: 4800, status: "PROCESSING", createdAt: daysAgo(3).toISOString(), paymentMethod: "INSTALMENT" },
    ],
  },
  {
    id: ID.userEmma, name: "Emma Davis", email: "emma@example.com",
    orders: 2, spent: 5650, lastOrder: "Jun 11, 2026", status: "VIP",
    createdAt: daysAgo(90).toISOString(),
    addresses: [{ id: "addr-emma-1", street: "45 Oak Street", city: "Colombo 07", state: "Western", zipCode: "00700", country: "Sri Lanka", isDefault: true }],
    ordersList: [
      { id: "ord-emma-1", totalAmount: 1850, status: "DELIVERED", createdAt: daysAgo(5).toISOString(), paymentMethod: "FULL_PAYMENT" },
      { id: "ord-emma-2", totalAmount: 3800, status: "SHIPPED", createdAt: daysAgo(2).toISOString(), paymentMethod: "FULL_PAYMENT" },
    ],
  },
  {
    id: ID.userNoah, name: "Noah Smith", email: "noah@example.com",
    orders: 1, spent: 2800, lastOrder: "Jun 10, 2026", status: "New",
    createdAt: daysAgo(14).toISOString(),
    addresses: [{ id: "addr-noah-1", street: "90 Sunset Blvd", city: "Nugegoda", state: "Western", zipCode: "10250", country: "Sri Lanka", isDefault: true }],
    ordersList: [
      { id: "ord-noah-1", totalAmount: 2800, status: "PENDING", createdAt: daysAgo(4).toISOString(), paymentMethod: "FULL_PAYMENT" },
    ],
  },
  {
    id: ID.userOlivia, name: "Olivia Wilson", email: "olivia@example.com",
    orders: 4, spent: 14200, lastOrder: "Jun 13, 2026", status: "VIP",
    createdAt: daysAgo(120).toISOString(),
    addresses: [{ id: "addr-olivia-1", street: "12 Galle Road", city: "Mount Lavinia", state: "Western", zipCode: "10370", country: "Sri Lanka", isDefault: true }],
    ordersList: [
      { id: "ord-olivia-1", totalAmount: 5200, status: "DELIVERED", createdAt: daysAgo(1).toISOString(), paymentMethod: "INSTALMENT" },
      { id: "ord-olivia-2", totalAmount: 6500, status: "SHIPPED", createdAt: daysAgo(7).toISOString(), paymentMethod: "INSTALMENT" },
      { id: "ord-olivia-3", totalAmount: 2500, status: "DELIVERED", createdAt: daysAgo(20).toISOString(), paymentMethod: "FULL_PAYMENT" },
    ],
  },
];

// ─── ORDERS ───────────────────────────────────────────────────────────────
export const demoOrders = [
  {
    id: "ord-liam-2", userId: ID.userLiam,
    user: { id: ID.userLiam, name: "Liam Johnson", email: "liam@example.com" },
    totalAmount: 4800, status: "PROCESSING", paymentMethod: "INSTALMENT",
    shippingAddress: { street: "128 Luxury Ave", city: "Colombo", state: "Western", zipCode: "00700", country: "Sri Lanka" },
    createdAt: daysAgo(3).toISOString(), updatedAt: daysAgo(3).toISOString(),
    orderItems: [{ id: "oi-1", productId: ID.p06, quantity: 1, price: 4800, product: { name: "Elysian Canopy Bed", images: [{ url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800" }] } }],
    instalmentPlan: { id: "inst-1", status: "ACTIVE", paidAmount: 1600, totalAmount: 4800 },
  },
  {
    id: "ord-olivia-1", userId: ID.userOlivia,
    user: { id: ID.userOlivia, name: "Olivia Wilson", email: "olivia@example.com" },
    totalAmount: 5200, status: "DELIVERED", paymentMethod: "INSTALMENT",
    shippingAddress: { street: "12 Galle Road", city: "Mount Lavinia", state: "Western", zipCode: "10370", country: "Sri Lanka" },
    createdAt: daysAgo(1).toISOString(), updatedAt: daysAgo(1).toISOString(),
    orderItems: [{ id: "oi-2", productId: ID.p04, quantity: 1, price: 5200, product: { name: "Bespoke Bouclé Sofa", images: [{ url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" }] } }],
    instalmentPlan: { id: "inst-2", status: "COMPLETED", paidAmount: 5200, totalAmount: 5200 },
  },
  {
    id: "ord-emma-2", userId: ID.userEmma,
    user: { id: ID.userEmma, name: "Emma Davis", email: "emma@example.com" },
    totalAmount: 3800, status: "SHIPPED", paymentMethod: "FULL_PAYMENT",
    shippingAddress: { street: "45 Oak Street", city: "Colombo 07", state: "Western", zipCode: "00700", country: "Sri Lanka" },
    createdAt: daysAgo(2).toISOString(), updatedAt: daysAgo(2).toISOString(),
    orderItems: [{ id: "oi-3", productId: ID.p09, quantity: 1, price: 3600, product: { name: "Japanese Oak Bed Frame", images: [{ url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800" }] } }],
    instalmentPlan: null,
  },
  {
    id: "ord-noah-1", userId: ID.userNoah,
    user: { id: ID.userNoah, name: "Noah Smith", email: "noah@example.com" },
    totalAmount: 2800, status: "PENDING", paymentMethod: "FULL_PAYMENT",
    shippingAddress: { street: "90 Sunset Blvd", city: "Nugegoda", state: "Western", zipCode: "10250", country: "Sri Lanka" },
    createdAt: daysAgo(4).toISOString(), updatedAt: daysAgo(4).toISOString(),
    orderItems: [{ id: "oi-4", productId: ID.p11, quantity: 1, price: 2800, product: { name: "Walnut Dining Table", images: [{ url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800" }] } }],
    instalmentPlan: null,
  },
  {
    id: "ord-liam-1", userId: ID.userLiam,
    user: { id: ID.userLiam, name: "Liam Johnson", email: "liam@example.com" },
    totalAmount: 3400, status: "DELIVERED", paymentMethod: "FULL_PAYMENT",
    shippingAddress: { street: "128 Luxury Ave", city: "Colombo", state: "Western", zipCode: "00700", country: "Sri Lanka" },
    createdAt: daysAgo(6).toISOString(), updatedAt: daysAgo(6).toISOString(),
    orderItems: [{ id: "oi-5", productId: ID.p02, quantity: 1, price: 3400, product: { name: "Nordic Minimalist Sofa", images: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" }] } }],
    instalmentPlan: null,
  },
  {
    id: "ord-olivia-2", userId: ID.userOlivia,
    user: { id: ID.userOlivia, name: "Olivia Wilson", email: "olivia@example.com" },
    totalAmount: 6500, status: "SHIPPED", paymentMethod: "INSTALMENT",
    shippingAddress: { street: "12 Galle Road", city: "Mount Lavinia", state: "Western", zipCode: "10370", country: "Sri Lanka" },
    createdAt: daysAgo(7).toISOString(), updatedAt: daysAgo(7).toISOString(),
    orderItems: [{ id: "oi-6", productId: ID.p17, quantity: 1, price: 6500, product: { name: "Constellation Chandelier", images: [{ url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800" }] } }],
    instalmentPlan: { id: "inst-3", status: "ACTIVE", paidAmount: 2166, totalAmount: 6500 },
  },
];

// ─── INSTALMENT PLANS ─────────────────────────────────────────────────────
export const demoInstalments = [
  {
    id: "inst-1",
    orderId: "ord-liam-2",
    totalAmount: 4800, paidAmount: 1600, tenureMonths: 3, interestRate: 0,
    status: "ACTIVE",
    createdAt: daysAgo(3).toISOString(), updatedAt: daysAgo(3).toISOString(),
    order: {
      id: "ord-liam-2", createdAt: daysAgo(3).toISOString(), totalAmount: 4800, paymentMethod: "INSTALMENT",
      user: { id: ID.userLiam, name: "Liam Johnson", email: "liam@example.com" },
      orderItems: [{ product: { name: "Elysian Canopy Bed", images: [{ url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800" }] } }],
    },
    payments: [
      { id: "pay-inst1-1", instalmentId: "inst-1", amount: 1600, dueDate: daysAgo(25).toISOString(), paidDate: daysAgo(25).toISOString(), status: "PAID", createdAt: daysAgo(3).toISOString() },
      { id: "pay-inst1-2", instalmentId: "inst-1", amount: 1600, dueDate: daysAgo(5).toISOString(), paidDate: null, status: "OVERDUE", createdAt: daysAgo(3).toISOString() },
      { id: "pay-inst1-3", instalmentId: "inst-1", amount: 1600, dueDate: daysFromNow(25).toISOString(), paidDate: null, status: "PENDING", createdAt: daysAgo(3).toISOString() },
    ],
  },
  {
    id: "inst-2",
    orderId: "ord-olivia-1",
    totalAmount: 5200, paidAmount: 5200, tenureMonths: 3, interestRate: 0,
    status: "COMPLETED",
    createdAt: daysAgo(90).toISOString(), updatedAt: daysAgo(1).toISOString(),
    order: {
      id: "ord-olivia-1", createdAt: daysAgo(1).toISOString(), totalAmount: 5200, paymentMethod: "INSTALMENT",
      user: { id: ID.userOlivia, name: "Olivia Wilson", email: "olivia@example.com" },
      orderItems: [{ product: { name: "Bespoke Bouclé Sofa", images: [{ url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" }] } }],
    },
    payments: [
      { id: "pay-inst2-1", instalmentId: "inst-2", amount: 1733.33, dueDate: daysAgo(60).toISOString(), paidDate: daysAgo(60).toISOString(), status: "PAID", createdAt: daysAgo(90).toISOString() },
      { id: "pay-inst2-2", instalmentId: "inst-2", amount: 1733.33, dueDate: daysAgo(30).toISOString(), paidDate: daysAgo(30).toISOString(), status: "PAID", createdAt: daysAgo(90).toISOString() },
      { id: "pay-inst2-3", instalmentId: "inst-2", amount: 1733.34, dueDate: daysAgo(1).toISOString(), paidDate: daysAgo(1).toISOString(), status: "PAID", createdAt: daysAgo(90).toISOString() },
    ],
  },
  {
    id: "inst-3",
    orderId: "ord-olivia-2",
    totalAmount: 6500, paidAmount: 2166, tenureMonths: 3, interestRate: 0,
    status: "ACTIVE",
    createdAt: daysAgo(7).toISOString(), updatedAt: daysAgo(7).toISOString(),
    order: {
      id: "ord-olivia-2", createdAt: daysAgo(7).toISOString(), totalAmount: 6500, paymentMethod: "INSTALMENT",
      user: { id: ID.userOlivia, name: "Olivia Wilson", email: "olivia@example.com" },
      orderItems: [{ product: { name: "Constellation Chandelier", images: [{ url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800" }] } }],
    },
    payments: [
      { id: "pay-inst3-1", instalmentId: "inst-3", amount: 2166.67, dueDate: daysAgo(7).toISOString(), paidDate: daysAgo(7).toISOString(), status: "PAID", createdAt: daysAgo(7).toISOString() },
      { id: "pay-inst3-2", instalmentId: "inst-3", amount: 2166.67, dueDate: daysFromNow(2).toISOString(), paidDate: null, status: "PENDING", createdAt: daysAgo(7).toISOString() },
      { id: "pay-inst3-3", instalmentId: "inst-3", amount: 2166.66, dueDate: daysFromNow(32).toISOString(), paidDate: null, status: "PENDING", createdAt: daysAgo(7).toISOString() },
    ],
  },
];

// ─── DASHBOARD DATA ───────────────────────────────────────────────────────
export const demoDashboard = {
  kpis: {
    totalRevenue: 26500,
    revenueGrowth: 20.1,
    totalOrdersCount: 6,
    ordersGrowth: 18.4,
    pendingInstalmentsCount: 2,
    lowStockAlertsCount: 8,
  },
  alerts: {
    overdue: { count: 1, totalAmount: 1600 },
    dueSoon: { count: 1, totalAmount: 2166.67 },
  },
  salesData: [
    { name: "Mon", total: 3400 },
    { name: "Tue", total: 2800 },
    { name: "Wed", total: 5200 },
    { name: "Thu", total: 1850 },
    { name: "Fri", total: 6500 },
    { name: "Sat", total: 4800 },
    { name: "Sun", total: 1950 },
  ],
  topSelling: [
    { name: "Ceramic Table Lamp", sales: 25, revenue: 11250 },
    { name: "Aria Lounge Chair", sales: 12, revenue: 15000 },
    { name: "Nordic Minimalist Sofa", sales: 8, revenue: 27200 },
    { name: "Walnut Dining Table", sales: 4, revenue: 11200 },
    { name: "Imperial Dining Chair", sales: 40, revenue: 27200 },
  ],
  recentOrders: [
    { id: "#ORD-ORD-OL", customer: "Olivia Wilson", date: "Today, 10:30 AM", status: "Delivered", amount: 5200 },
    { id: "#ORD-ORD-EM", customer: "Emma Davis", date: "Yesterday, 2:15 PM", status: "Shipped", amount: 3800 },
    { id: "#ORD-ORD-LI", customer: "Liam Johnson", date: "Yesterday, 9:45 AM", status: "Processing", amount: 4800 },
    { id: "#ORD-ORD-NO", customer: "Noah Smith", date: "Jun 10, 4:00 PM", status: "Pending", amount: 2800 },
    { id: "#ORD-ORD-OL2", customer: "Olivia Wilson", date: "Jun 7, 11:20 AM", status: "Shipped", amount: 6500 },
  ],
};
