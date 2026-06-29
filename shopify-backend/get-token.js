const axios = require('axios');

async function getToken() {
  try {
    const response = await axios.post(
      'https://fhvfak-54.myshopify.com/admin/oauth/access_token',
      'grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    console.log("Token Response:", response.data);
  } catch (error) {
    console.error("Error getting token:", error.response?.data || error.message);
  }
}

getToken();
