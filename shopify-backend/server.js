const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// We will initialize Firebase Admin here if needed.
// For now, we will assume the frontend handles Firebase writes,
// OR the backend updates Firebase on webhook.

const app = express();
app.use(cors());

// Parse raw body for webhook verification, but parse json for standard routes
app.use(express.json());

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// 1. Create Order Route (called by frontend when user checks out)
app.post('/create-order', async (req, res) => {
  try {
    const { email, phone, name, address, items, total, firebaseOrderId } = req.body;

    if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
      console.warn("Shopify credentials not found. Simulating successful Shopify push.");
      return res.status(200).json({ success: true, simulated: true });
    }

    // Format items for Shopify
    const line_items = items.map(item => ({
      title: item.name,
      price: item.price,
      quantity: item.qty,
      // sku: item.productId // Un-comment if you have strict SKUs
    }));

    // Build the Shopify Order Payload
    const orderPayload = {
      order: {
        email: email,
        phone: phone,
        shipping_address: {
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' '),
          address1: address,
          city: '',
          province: '',
          country: 'India',
          zip: ''
        },
        line_items: line_items,
        tags: `firebase_order_id:${firebaseOrderId}`,
        send_receipt: true,
        send_fulfillment_receipt: true
      }
    };

    // Call Shopify API
    const response = await axios.post(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/orders.json`,
      orderPayload,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({ success: true, shopifyOrder: response.data.order });
  } catch (error) {
    console.error("Error creating Shopify order:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to push to Shopify' });
  }
});

// 2. Webhook receiver for order updates (called by Shopify)
app.post('/webhook/shopify', async (req, res) => {
  try {
    const shopifyOrder = req.body;
    console.log(`Received Shopify webhook for order ID ${shopifyOrder.id}`);

    // Here we would extract the firebaseOrderId from the tags
    const tags = shopifyOrder.tags || '';
    const match = tags.match(/firebase_order_id:([^\s,]+)/);
    
    if (match && match[1]) {
      const firebaseOrderId = match[1];
      let newStatus = 'Processing';

      // Map Shopify statuses to our Firebase statuses
      if (shopifyOrder.fulfillment_status === 'fulfilled') {
        newStatus = 'Delivered';
      } else if (shopifyOrder.fulfillment_status === 'partial') {
        newStatus = 'In-Transit';
      }

      if (shopifyOrder.cancelled_at) {
        newStatus = 'Cancelled';
      }

      console.log(`Order ${firebaseOrderId} updated to ${newStatus}`);
      
      // TODO: Update Firestore using Firebase Admin SDK
      // const db = admin.firestore();
      // await db.collection('orders').doc(firebaseOrderId).update({ status: newStatus });
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Webhook processing failed', error);
    res.status(500).send('Error processing webhook');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Shopify Backend running on port ${PORT}`);
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    console.log("⚠️  Running in SIMULATOR mode. Configure .env file to enable live Shopify sync.");
  }
});
