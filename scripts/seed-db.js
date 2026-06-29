import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase config
const configPath = path.resolve(__dirname, "../firebase-applet-config.json");
const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Initialize Firebase App for Node.js client
const app = initializeApp(configData);
const db = getFirestore(app);

async function seedDatabase() {
  console.log("Starting database schema initialization...");

  try {
    // 1. users
    await setDoc(doc(db, "users", "admin_setup"), {
      name: "Super Admin",
      email: "admin@agriic.com",
      role: "Super Admin",
      status: "Active",
      joinedAt: new Date().toISOString()
    });
    console.log("✅ Created 'users' collection");

    // 2. products
    await setDoc(doc(db, "products", "prod_setup_1"), {
      name: "Organic Neem Extract",
      category: "pest-control",
      price: 299,
      stock: 50,
      lowStockLimit: 10,
      desc: "Cold-pressed organic neem oil for natural pest resistance.",
      img: "https://images.unsplash.com/photo-1595859702581-1b072666daed?auto=format&fit=crop&w=400&q=80"
    });
    console.log("✅ Created 'products' collection");

    // 3. orders
    await setDoc(doc(db, "orders", "ORD_SETUP"), {
      farmerId: "admin_setup",
      farmerName: "Super Admin",
      items: [],
      total: 0,
      status: "Delivered",
      paymentMethod: "cod",
      address: "Setup Address",
      date: new Date().toISOString()
    });
    console.log("✅ Created 'orders' collection");

    // 4. soilReports
    await setDoc(doc(db, "soilReports", "REP_SETUP"), {
      farmerId: "admin_setup",
      farmerName: "Super Admin",
      farmName: "Test Farm",
      pH: 6.5,
      nitrogen: 40,
      phosphorus: 20,
      potassium: 15,
      moisture: 30,
      status: "Reviewed",
      actionTaken: "Schema initialization report",
      cropType: "General",
      uploadDate: new Date().toISOString()
    });
    console.log("✅ Created 'soilReports' collection");

    // 5. consultations
    await setDoc(doc(db, "consultations", "CON_SETUP"), {
      farmerId: "admin_setup",
      farmerName: "Super Admin",
      agronomistId: "ag_1",
      agronomistName: "Dr. Setup",
      date: new Date().toISOString().split('T')[0],
      timeSlot: "10:00 AM",
      notes: "Initial setup consultation",
      status: "Completed",
      npsScore: 10
    });
    console.log("✅ Created 'consultations' collection");

    // 6. settings
    await setDoc(doc(db, "settings", "global_workspace"), {
      primaryBrandName: "Agriic HQ",
      primaryColor: "#3B6D11",
      secondaryColor: "#0F6E56",
      enableSMS: true,
      enablePayments: true,
      enableWeather: true,
      twoFactorEnabled: false
    });
    console.log("✅ Created 'settings' collection");

    console.log("🎉 Database schema successfully initialized!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database schema:", error);
    process.exit(1);
  }
}

seedDatabase();
