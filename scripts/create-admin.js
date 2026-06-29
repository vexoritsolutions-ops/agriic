const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccountPath = './firebase-admin-key.json'; // Ensure this exists or mock it if using emulator

if (!fs.existsSync(serviceAccountPath)) {
  console.log('No service account key found. Please manually create the abhiirana2031@gmail.com user with password 987654321 in your Firebase Console.');
  process.exit(0);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createAdmin() {
  try {
    const userRecord = await admin.auth().createUser({
      email: 'abhiirana2031@gmail.com',
      password: '987654321',
      displayName: 'Super Admin',
    });
    console.log('Successfully created admin user:', userRecord.uid);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('Admin user already exists! Updating password just in case...');
      try {
        const user = await admin.auth().getUserByEmail('abhiirana2031@gmail.com');
        await admin.auth().updateUser(user.uid, {
          password: '987654321'
        });
        console.log('Admin password updated successfully.');
      } catch (updateErr) {
        console.error('Error updating admin:', updateErr);
      }
    } else {
      console.error('Error creating admin user:', error);
    }
  }
}

createAdmin();
