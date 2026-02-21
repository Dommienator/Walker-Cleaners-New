// api/mpesa.js - Vercel Serverless Function
// Handles: token generation, STK Push, and payment callback

const MPESA_BASE_URL = "https://sandbox.safaricom.co.ke"; // Change to https://api.safaricom.co.ke for production
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SHORTCODE = process.env.MPESA_SHORTCODE || "174379"; // Sandbox default
const PASSKEY =
  process.env.MPESA_PASSKEY ||
  "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; // Sandbox default passkey
const CALLBACK_URL =
  process.env.MPESA_CALLBACK_URL ||
  "https://walker-cleaners-yxvm.vercel.app/api/mpesa?action=callback";

// ─── Generate Access Token ────────────────────────────────────────────────────
async function getAccessToken() {
  const credentials = Buffer.from(
    `${CONSUMER_KEY}:${CONSUMER_SECRET}`,
  ).toString("base64");

  const response = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Token fetch failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.access_token;
}

// ─── Generate Password & Timestamp ───────────────────────────────────────────
function generatePassword() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString(
    "base64",
  );
  return { password, timestamp };
}

// ─── Initiate STK Push ────────────────────────────────────────────────────────
async function initiateSTKPush({ phone, amount, bookingRef, description }) {
  const token = await getAccessToken();
  const { password, timestamp } = generatePassword();

  // Normalize phone: strip leading 0 or + and ensure starts with 254
  const normalizedPhone = phone
    .replace(/\s+/g, "")
    .replace(/^\+/, "")
    .replace(/^0/, "254");

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(amount), // Must be integer
    PartyA: normalizedPhone,
    PartyB: SHORTCODE,
    PhoneNumber: normalizedPhone,
    CallBackURL: CALLBACK_URL,
    AccountReference: bookingRef || "WalkerCleaners",
    TransactionDesc: description || "Cleaning Service Payment",
  };

  const response = await fetch(
    `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (data.ResponseCode !== "0") {
    throw new Error(
      data.CustomerMessage || data.errorMessage || "STK Push failed",
    );
  }

  return {
    checkoutRequestId: data.CheckoutRequestID,
    merchantRequestId: data.MerchantRequestID,
    responseDescription: data.ResponseDescription,
  };
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const action = req.query.action;

  // ── STK Push: POST /api/mpesa?action=pay ──────────────────────────────────
  if (req.method === "POST" && action === "pay") {
    try {
      const { phone, amount, bookingRef, description } = req.body;

      if (!phone || !amount) {
        return res.status(400).json({
          success: false,
          message: "Phone number and amount are required",
        });
      }

      if (amount < 1) {
        return res.status(400).json({
          success: false,
          message: "Amount must be at least KES 1",
        });
      }

      const result = await initiateSTKPush({
        phone,
        amount,
        bookingRef,
        description,
      });

      return res.status(200).json({
        success: true,
        message:
          "Payment prompt sent to your phone. Enter your Mpesa PIN to complete.",
        checkoutRequestId: result.checkoutRequestId,
        merchantRequestId: result.merchantRequestId,
      });
    } catch (error) {
      console.error("STK Push error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to initiate payment",
      });
    }
  }

  // ── Callback: POST /api/mpesa?action=callback ─────────────────────────────
  // Safaricom calls this URL after payment is processed
  if (req.method === "POST" && action === "callback") {
    try {
      const { Body } = req.body;

      if (!Body || !Body.stkCallback) {
        return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
      }

      const callback = Body.stkCallback;
      const resultCode = callback.ResultCode;
      const checkoutRequestId = callback.CheckoutRequestID;

      if (resultCode === 0) {
        // Payment successful
        const items = callback.CallbackMetadata?.Item || [];
        const getMeta = (name) => items.find((i) => i.Name === name)?.Value;

        const paymentData = {
          mpesaReceiptNumber: getMeta("MpesaReceiptNumber"),
          amount: getMeta("Amount"),
          phone: getMeta("PhoneNumber"),
          transactionDate: getMeta("TransactionDate"),
          checkoutRequestId,
        };

        console.log("✅ Payment successful:", paymentData);

        // TODO: Update booking status in Supabase using checkoutRequestId
        // You can add Supabase update here if needed
      } else {
        // Payment failed or cancelled
        console.log(
          "❌ Payment failed. ResultCode:",
          resultCode,
          "CheckoutRequestID:",
          checkoutRequestId,
        );
      }

      // Always respond 200 to Safaricom or they'll keep retrying
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    } catch (error) {
      console.error("Callback error:", error);
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }
  }

  // ── Query Payment Status: POST /api/mpesa?action=query ───────────────────
  if (req.method === "POST" && action === "query") {
    try {
      const { checkoutRequestId } = req.body;
      const token = await getAccessToken();
      const { password, timestamp } = generatePassword();

      const response = await fetch(
        `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId,
          }),
        },
      );

      const data = await response.json();

      return res.status(200).json({
        success: true,
        resultCode: data.ResultCode,
        resultDesc: data.ResultDesc,
        paid: data.ResultCode === "0",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  return res.status(404).json({ message: "Unknown action" });
}
