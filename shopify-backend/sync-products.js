const axios = require('axios');
require('dotenv').config();

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

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

async function syncProducts() {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    console.error("Missing Shopify credentials in .env");
    process.exit(1);
  }

  for (const p of SEED_PRODUCTS) {
    console.log(`Syncing ${p.name}...`);
    try {
      const payload = {
        product: {
          title: p.name,
          body_html: `<p>${p.desc}</p>`,
          vendor: "Agriic",
          product_type: p.category,
          status: "active",
          variants: [
            {
              price: p.price,
              sku: p.id
              // We removed inventory_management because it requires Location IDs to set stock via API directly for new products.
            }
          ],
          images: [
            { src: p.img }
          ]
        }
      };

      const res = await axios.post(
        `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/products.json`,
        payload,
        {
          headers: {
            'X-Shopify-Access-Token': SHOPIFY_TOKEN,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`✅ Success! Created ${p.name} with ID ${res.data.product.id}`);
    } catch (error) {
      console.error(`❌ Failed to create ${p.name}:`, error.response?.data || error.message);
    }
  }
  console.log("All done!");
}

syncProducts();
