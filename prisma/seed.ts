import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "MYSQLsupun@2001",
  database: "furniture_shop_db",
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning database...");
  
  // Clean in correct order of dependency
  await prisma.review.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.instalmentPayment.deleteMany({});
  await prisma.instalment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.subCategory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.coupon.deleteMany({});

  console.log("Seeding began...");

  // 1. Create admin user
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@furnitureshop.com",
      role: "ADMIN",
      // Simple hashed password for placeholder or test admin login
      password: "password123", 
    },
  });
  console.log("Admin User created.");

  // 2. Create Brands
  const brandNordic = await prisma.brand.create({
    data: { name: "Nordic Living", slug: "nordic-living", description: "Minimalist Scandinavian designs focusing on warmth, light, and natural timber." }
  });
  const brandArtisan = await prisma.brand.create({
    data: { name: "Artisan Woodworks", slug: "artisan-woodworks", description: "Bespoke, handcrafted solid wood masterpieces crafted by legacy carpenters." }
  });
  const brandLumen = await prisma.brand.create({
    data: { name: "Lumen Exclusives", slug: "lumen-exclusives", description: "Avant-garde architectural lighting designed to transform space and atmosphere." }
  });
  const brandVelvet = await prisma.brand.create({
    data: { name: "Velvet & Co.", slug: "velvet-and-co", description: "Ultra-luxurious upholstered furniture clad in the world's finest premium fabrics." }
  });
  const brandModern = await prisma.brand.create({
    data: { name: "Modern Light", slug: "modern-light", description: "Contemporary and functional minimalist lighting fixtures." }
  });
  console.log("Brands created.");

  // 3. Create Categories & Subcategories
  const catLiving = await prisma.category.create({
    data: { name: "Living Room", slug: "living-room", description: "Premium lounging systems, accent chairs, and designer tables." }
  });
  const subSofas = await prisma.subCategory.create({
    data: { name: "Sofas", slug: "sofas", categoryId: catLiving.id }
  });
  const subLoungeChairs = await prisma.subCategory.create({
    data: { name: "Lounge Chairs", slug: "lounge-chairs", categoryId: catLiving.id }
  });
  const subCoffeeTables = await prisma.subCategory.create({
    data: { name: "Coffee Tables", slug: "coffee-tables", categoryId: catLiving.id }
  });

  const catBedroom = await prisma.category.create({
    data: { name: "Bedroom", slug: "bedroom", description: "Plush beds, designer nightstands, and premium wardrobes." }
  });
  const subBeds = await prisma.subCategory.create({
    data: { name: "Beds", slug: "beds", categoryId: catBedroom.id }
  });
  const subNightstands = await prisma.subCategory.create({
    data: { name: "Nightstands", slug: "nightstands", categoryId: catBedroom.id }
  });
  const subWardrobes = await prisma.subCategory.create({
    data: { name: "Wardrobes", slug: "wardrobes", categoryId: catBedroom.id }
  });

  const catDining = await prisma.category.create({
    data: { name: "Dining Room", slug: "dining-room", description: "Exquisite solid timber tables, premium seating, and marble credenzas." }
  });
  const subDiningTables = await prisma.subCategory.create({
    data: { name: "Dining Tables", slug: "dining-tables", categoryId: catDining.id }
  });
  const subDiningChairs = await prisma.subCategory.create({
    data: { name: "Dining Chairs", slug: "dining-chairs", categoryId: catDining.id }
  });
  const subCabinets = await prisma.subCategory.create({
    data: { name: "Cabinets", slug: "cabinets", categoryId: catDining.id }
  });

  const catLighting = await prisma.category.create({
    data: { name: "Lighting", slug: "lighting", description: "Sculptural chandeliers, custom brass fixtures, and table lamps." }
  });
  const subChandeliers = await prisma.subCategory.create({
    data: { name: "Chandeliers", slug: "chandeliers", categoryId: catLighting.id }
  });
  const subTableLamps = await prisma.subCategory.create({
    data: { name: "Table Lamps", slug: "table-lamps", categoryId: catLighting.id }
  });
  const subFloorLamps = await prisma.subCategory.create({
    data: { name: "Floor Lamps", slug: "floor-lamps", categoryId: catLighting.id }
  });
  console.log("Categories & Subcategories created.");

  // 4. Seeding 20 Products
  const productsData = [
    // --- LIVING ROOM ---
    {
      name: "Aria Lounge Chair",
      slug: "aria-lounge-chair",
      description: "A signature lounging masterpiece wrapped in premium, high-pile cream bouclé. Supported by an organic matte black steel structure, this chair provides a deep, plush seating experience that naturally hugs the contours of the body. Absolute luxury for the modern living room.",
      basePrice: 1250,
      categoryId: catLiving.id,
      subCategoryId: subLoungeChairs.id,
      brandId: brandVelvet.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Cream Bouclé", material: "Bouclé Fabric & Steel", size: "Standard", stock: 15, priceOffset: 0 },
        { color: "Charcoal Grey", material: "Wool Blend & Steel", size: "Standard", stock: 10, priceOffset: 120 }
      ]
    },
    {
      name: "Nordic Minimalist Sofa",
      slug: "nordic-minimalist-sofa",
      description: "Crafted with clean lines and absolute proportions, the Nordic Modular Sofa offers unparalleled comfort. Features a solid kiln-dried pine frame, high-density foam padding with feather filling, and a robust yet soft sand-toned linen fabric finish.",
      basePrice: 3400,
      categoryId: catLiving.id,
      subCategoryId: subSofas.id,
      brandId: brandNordic.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Sand Linen", material: "Linen & Pine Wood", size: "3-Seater", stock: 8, priceOffset: 0 },
        { color: "Warm Grey Linen", material: "Linen & Pine Wood", size: "4-Seater", stock: 5, priceOffset: 450 }
      ]
    },
    {
      name: "Fluted Marble Coffee Table",
      slug: "fluted-marble-coffee-table",
      description: "An architectural center-piece crafted from solid Arabescato marble. Features a beautifully fluted cylindrical base and a polished circular top with naturally rich, dark veining. The absolute epitome of stone craftsmanship.",
      basePrice: 1850,
      categoryId: catLiving.id,
      subCategoryId: subCoffeeTables.id,
      brandId: brandNordic.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Arabescato White", material: "Solid Marble", size: "90cm Diameter", stock: 12, priceOffset: 0 }
      ]
    },
    {
      name: "Bespoke Bouclé Sofa",
      slug: "bespoke-boucle-sofa",
      description: "Indulging curvilinear shapes define the Bespoke Sofa. CLad entirely in high-end ivory bouclé fabric, its continuous low profile structure rests on a hidden recessed base, giving it a floating cloud-like appearance.",
      basePrice: 5200,
      categoryId: catLiving.id,
      subCategoryId: subSofas.id,
      brandId: brandVelvet.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Ivory", material: "Bouclé & Hardwood", size: "Curved 4-Seater", stock: 4, priceOffset: 0 }
      ]
    },
    {
      name: "Tuscan Leather Armchair",
      slug: "tuscan-leather-armchair",
      description: "A heritage leather armchair constructed using hand-dyed Italian full-grain cognac leather. The warm-toned timber legs and stitched leather detailing highlight its exceptional luxury credentials.",
      basePrice: 2100,
      categoryId: catLiving.id,
      subCategoryId: subLoungeChairs.id,
      brandId: brandVelvet.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Cognac Brown", material: "Italian Leather & Walnut", size: "Standard", stock: 6, priceOffset: 0 }
      ]
    },

    // --- BEDROOM ---
    {
      name: "Elysian Canopy Bed",
      slug: "elysian-canopy-bed",
      description: "An elegant structural canopy bed made of deep American walnut. Includes a cushioned, tufted headboard in textured natural linen. This bed framework projects a commanding yet serene presence in high-end master suites.",
      basePrice: 4800,
      categoryId: catBedroom.id,
      subCategoryId: subBeds.id,
      brandId: brandArtisan.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Natural Walnut", material: "Walnut & Linen", size: "King Size", stock: 5, priceOffset: 0 },
        { color: "Natural Walnut", material: "Walnut & Linen", size: "Queen Size", stock: 7, priceOffset: -400 }
      ]
    },
    {
      name: "Monarch Nightstand",
      slug: "monarch-nightstand",
      description: "Matching the Elysian range, the Monarch features soft-close drawers clad in premium woven cane, perfectly offset by a dark walnut frame and elegant brass drawer pulls.",
      basePrice: 750,
      categoryId: catBedroom.id,
      subCategoryId: subNightstands.id,
      brandId: brandArtisan.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1532372320978-9b4d8a3a0245?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Natural Walnut", material: "Walnut & French Cane", size: "Standard", stock: 24, priceOffset: 0 }
      ]
    },
    {
      name: "Minimalist Oak Wardrobe",
      slug: "minimalist-oak-wardrobe",
      description: "A large floor-to-ceiling wardrobe constructed of light white oak. Features seamless integrated handles, soft-close hinges, and extensive internal customization options including leather-lined jewelry drawers.",
      basePrice: 3200,
      categoryId: catBedroom.id,
      subCategoryId: subWardrobes.id,
      brandId: brandNordic.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1558882224-cca16673336d?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "White Oak", material: "Solid Oak", size: "Double Cabinet", stock: 3, priceOffset: 0 },
        { color: "White Oak", material: "Solid Oak", size: "Triple Cabinet", stock: 2, priceOffset: 950 }
      ]
    },
    {
      name: "Japanese Oak Bed Frame",
      slug: "japanese-oak-bed-frame",
      description: "Deeply low-profile platform bed referencing warm Japanese minimalism. Features exceptionally wide side ledges, solid joint details, and a floating base look.",
      basePrice: 3600,
      categoryId: catBedroom.id,
      subCategoryId: subBeds.id,
      brandId: brandNordic.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Natural Oak", material: "Oak Wood", size: "King Size", stock: 9, priceOffset: 0 }
      ]
    },
    {
      name: "Art Deco Dressing Table",
      slug: "art-deco-dressing-table",
      description: "A gorgeous dressing table finished in a dark ash timber veneer, accented with circular bronze mirrors and soft velvet-lined drawers.",
      basePrice: 2450,
      categoryId: catBedroom.id,
      subCategoryId: subNightstands.id,
      brandId: brandVelvet.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Ebonized Ash & Bronze", material: "Ash Wood & Mirror", size: "Standard", stock: 6, priceOffset: 0 }
      ]
    },

    // --- DINING ROOM ---
    {
      name: "Walnut Dining Table",
      slug: "walnut-dining-table",
      description: "A massive, gorgeous dining table featuring an expansive 2.4-meter solid walnut plank top with raw organic live edges, resting on two bold brushed brass pedestals.",
      basePrice: 2800,
      categoryId: catDining.id,
      subCategoryId: subDiningTables.id,
      brandId: brandArtisan.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Natural Walnut", material: "Solid Walnut & Brass", size: "2.4 Meters", stock: 5, priceOffset: 0 },
        { color: "Natural Walnut", material: "Solid Walnut & Brass", size: "3.0 Meters", stock: 3, priceOffset: 600 }
      ]
    },
    {
      name: "Imperial Dining Chair",
      slug: "imperial-dining-chair",
      description: "A highly comfortable dining chair showcasing curved bentwood oak construction, completed with a premium cushioned seat pad upholstered in rich charcoal boucle.",
      basePrice: 680,
      categoryId: catDining.id,
      subCategoryId: subDiningChairs.id,
      brandId: brandArtisan.id,
      isEmiEligible: false,
      images: [
        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Charcoal & Bentwood", material: "Oak Wood & Bouclé", size: "Standard", stock: 40, priceOffset: 0 }
      ]
    },
    {
      name: "Travertine Credenza",
      slug: "travertine-credenza",
      description: "A stunning statement credenza clad entirely in cream-toned Roman travertine stone. Features three cupboards with internal timber shelves, presenting generous storage with sculptural form.",
      basePrice: 3900,
      categoryId: catDining.id,
      subCategoryId: subCabinets.id,
      brandId: brandNordic.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Honed Travertine", material: "Travertine Stone", size: "180cm Width", stock: 4, priceOffset: 0 }
      ]
    },
    {
      name: "Sleek Walnut Sideboard",
      slug: "sleek-walnut-sideboard",
      description: "Constructed of high-quality American Walnut, this sideboard has beautiful slatted sliding doors that elegantly conceal internal glass shelving.",
      basePrice: 2600,
      categoryId: catDining.id,
      subCategoryId: subCabinets.id,
      brandId: brandArtisan.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Natural Walnut", material: "Walnut Wood & Glass", size: "160cm Width", stock: 8, priceOffset: 0 }
      ]
    },
    {
      name: "Metropolitan Dining Set",
      slug: "metropolitan-dining-set",
      description: "A fully curated dining experience. Includes our 2.4-meter Walnut dining table and a set of six Imperial dining chairs at a bundled luxurious value.",
      basePrice: 6200, // Bundled price
      categoryId: catDining.id,
      subCategoryId: subDiningTables.id,
      brandId: brandArtisan.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Natural Walnut & Charcoal", material: "Walnut, Oak, & Fabric", size: "Standard Set", stock: 3, priceOffset: 0 }
      ]
    },

    // --- LIGHTING ---
    {
      name: "Ceramic Table Lamp",
      slug: "ceramic-table-lamp",
      description: "A gorgeous sculptural table lamp. The base is crafted from hand-thrown white ceramic with a textured, tactile sand glaze. Topped with a custom textured beige linen drum shade that projects warm, diffused lighting.",
      basePrice: 450,
      categoryId: catLighting.id,
      subCategoryId: subTableLamps.id,
      brandId: brandLumen.id,
      isEmiEligible: false,
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Glazed Sand Ceramic", material: "Ceramic & Linen", size: "55cm Height", stock: 85, priceOffset: 0 }
      ]
    },
    {
      name: "Constellation Chandelier",
      slug: "constellation-chandelier",
      description: "An architectural masterpiece. Features twelve hand-blown glass globes mounted on a brushed solid brass structure. Emits a stunning ambient glow, mimicking a star-filled night sky.",
      basePrice: 6500,
      categoryId: catLighting.id,
      subCategoryId: subChandeliers.id,
      brandId: brandLumen.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Brushed Solid Brass", material: "Brass & Hand-Blown Glass", size: "120cm Diameter", stock: 2, priceOffset: 0 }
      ]
    },
    {
      name: "Aura Brass Floor Lamp",
      slug: "aura-brass-floor-lamp",
      description: "An elegant, towering floor lamp made of polished raw brass. Includes an adjustable arched neck and heavy marble base weight to guarantee perfect stability.",
      basePrice: 950,
      categoryId: catLighting.id,
      subCategoryId: subFloorLamps.id,
      brandId: brandModern.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Polished Brass & Marble", material: "Brass & Marble", size: "180cm Height", stock: 15, priceOffset: 0 }
      ]
    },
    {
      name: "Celestial Pendant Light",
      slug: "celestial-pendant-light",
      description: "A single drop sculptural pendant light with a fluted ceramic shade. Perfect for lining above kitchen islands or high-end bar spaces.",
      basePrice: 1400,
      categoryId: catLighting.id,
      subCategoryId: subChandeliers.id,
      brandId: brandModern.id,
      isEmiEligible: true,
      images: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Fluted Ceramic White", material: "Ceramic & Brass", size: "30cm Diameter", stock: 18, priceOffset: 0 }
      ]
    },
    {
      name: "Warm Ambience Bed Lamp",
      slug: "warm-ambience-bed-lamp",
      description: "A small, elegant bedside lamp with a heavy black travertine block base and a glowing spherical frosted glass bulb.",
      basePrice: 380,
      categoryId: catLighting.id,
      subCategoryId: subTableLamps.id,
      brandId: brandLumen.id,
      isEmiEligible: false,
      images: [
        "https://images.unsplash.com/photo-1542728928-1413d1894ed1?auto=format&fit=crop&q=80&w=800"
      ],
      variants: [
        { color: "Matte Black Travertine", material: "Travertine & Glass", size: "30cm Height", stock: 45, priceOffset: 0 }
      ]
    }
  ];

  for (const prod of productsData) {
    const product = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        basePrice: prod.basePrice,
        categoryId: prod.categoryId,
        subCategoryId: prod.subCategoryId,
        brandId: prod.brandId,
        isEmiEligible: prod.isEmiEligible,
        images: {
          create: prod.images.map(img => ({ url: img }))
        },
        variants: {
          create: prod.variants.map(v => ({
            color: v.color,
            material: v.material,
            size: v.size,
            stock: v.stock,
            priceOffset: v.priceOffset
          }))
        }
      }
    });
    console.log(`Product "${product.name}" created.`);
  }

  // 5. Create some seed coupons
  await prisma.coupon.create({
    data: {
      code: "LUMEN10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      expiryDate: new Date("2027-12-31"),
      usageLimit: 100
    }
  });
  await prisma.coupon.create({
    data: {
      code: "WELCOME500",
      discountType: "FIXED",
      discountValue: 500,
      expiryDate: new Date("2027-12-31"),
      usageLimit: 50
    }
  });
  console.log("Coupons created.");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
