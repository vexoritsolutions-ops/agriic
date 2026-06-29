import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
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

const TARGET_EMAIL = "abhiirana2031@gmail.com";

async function makeAdmin() {
  try {
    const q = query(collection(db, "users"), where("email", "==", TARGET_EMAIL));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`User not found in Firestore. Creating a new admin user document...`);
      // We don't have the exact Firebase Auth UID, so we'll generate one
      const newUserId = "admin_" + Date.now();
      await setDoc(doc(db, "users", newUserId), {
        id: newUserId,
        email: TARGET_EMAIL,
        name: "Abhay Rana",
        role: "Super Admin",
        status: "Active",
        joinedAt: new Date().toISOString()
      });
      console.log(`✅ Successfully created new 'Super Admin' document for ${TARGET_EMAIL}!`);
    } else {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, {
        role: "Super Admin"
      });
      console.log(`✅ Successfully updated role for existing user ${TARGET_EMAIL} to 'Super Admin'!`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting user as admin:", error);
    process.exit(1);
  }
}

makeAdmin();
