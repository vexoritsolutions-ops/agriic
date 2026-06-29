import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import fs from "fs";

// Load config
const configPath = './firebase-applet-config.json';
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function wipeDemo() {
  console.log("Authenticating as admin...");
  try {
    await signInWithEmailAndPassword(auth, 'abhiirana2031@gmail.com', '987654321');
    console.log("Authenticated successfully.");
  } catch (e) {
    console.error("Auth failed. Ensure the admin account exists and password is correct.", e.message);
    process.exit(1);
  }

  const collections = [
    { name: "users", prefix: "FARMER_" },
    { name: "products", prefix: "PROD_" },
    { name: "orders", prefix: "ORD_" },
    { name: "soilReports", prefix: "REP_" },
    { name: "deficiencyRules", prefix: "RULE_" },
    { name: "nutritionPlans", prefix: "PLAN_" },
    { name: "consultations", prefix: "CONS_" },
    { name: "content", prefix: "ART_" },
    { name: "content", prefix: "VID_" },
    { name: "supportTickets", prefix: "TIC-" },
    { name: "activities", prefix: "ACT_" }
  ];

  for (const c of collections) {
    console.log(`Checking collection ${c.name} for prefix ${c.prefix}...`);
    const snap = await getDocs(collection(db, c.name));
    let count = 0;
    for (const d of snap.docs) {
      if (d.id.startsWith(c.prefix)) {
        await deleteDoc(doc(db, c.name, d.id));
        count++;
      }
    }
    console.log(`Deleted ${count} demo documents from ${c.name}`);
  }

  console.log("Demo data wipe complete!");
  process.exit(0);
}

wipeDemo();
