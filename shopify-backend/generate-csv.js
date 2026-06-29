const fs = require('fs');

const SEED_PRODUCTS = [
  {
    id: "core-npk",
    name: "Agriic Core NPK Formula",
    category: "nutrition",
    price: 349,
    stock: 140,
    desc: "Sustained-release nitrogen, phosphorus, and potassium balance for all plants, optimized for Indian soils.",
    img: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "bloom-booster",
    name: "Bloom Booster Micro-nutrients",
    category: "nutrition",
    price: 399,
    stock: 12,
    desc: "High phosphorus and calcium formula designed to maximize flowering, fruiting, and vibrant bud formation.",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "neem-shield",
    name: "Agriic Neem Pest Shield",
    category: "pest-control",
    price: 299,
    stock: 8,
    desc: "100% cold-pressed neem oil spray for natural insect control and leaf shine, protecting your crops gently.",
    img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "root-stimulator",
    name: "Root Stimulator (Seaweed Extract)",
    category: "nutrition",
    price: 449,
    stock: 75,
    desc: "Enhanced root development formula with premium cold water kelp to promote deep, strong nutrient channels.",
    img: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "soil-healer",
    name: "Active Soil Healer",
    category: "soil-health",
    price: 499,
    stock: 110,
    desc: "Humus and fulvic acid rich powder to restore depleted soil structure, bio-fertility, and moisture tolerance.",
    img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ph-tester",
    name: "Precision Soil pH Probe",
    category: "tools",
    price: 549,
    stock: 4,
    desc: "Instant digital display probe to keep track of soil acidity levels and root water metrics in real-time.",
    img: "https://images.unsplash.com/photo-1581574919402-5b7d733224d6?auto=format&fit=crop&w=400&q=80"
  }
];

const headers = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Published",
  "Option1 Name", "Option1 Value", "Variant SKU", "Variant Inventory Tracker",
  "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service",
  "Variant Price", "Variant Requires Shipping", "Variant Taxable", "Image Src"
].join(",");

const rows = SEED_PRODUCTS.map(p => {
  return [
    p.id, // Handle
    `"${p.name}"`, // Title
    `"${p.desc}"`, // Body
    "Agriic", // Vendor
    p.category, // Type
    "TRUE", // Published
    "Title", // Option1 Name
    "Default Title", // Option1 Value
    p.id, // Variant SKU
    "shopify", // Tracker
    p.stock, // Qty
    "deny", // Policy
    "manual", // Fulfillment
    p.price, // Price
    "TRUE", // Requires Shipping
    "TRUE", // Taxable
    p.img // Image Src
  ].join(",");
});

fs.writeFileSync('../shopify_products.csv', headers + '\n' + rows.join('\n'));
console.log("shopify_products.csv generated successfully!");
