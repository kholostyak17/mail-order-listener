const axios = require("axios");
const { getHeaders } = require("./request-data");

async function startAssignProcess() {
  // -------------------- SIGN IN PLATFORM TO GET ACCESS TOKEN --------------------
  const auth = await getAccessToken();
  console.log("--> sucessfully signed in!");

  // -------------------- GET ORDERS LIST --------------------
  const ordersResponse = await getOrders(auth);
  const order = ordersResponse?.data?.[0];

  // -------------------- CHECK IF ANY ORDER IS AVAILABLE --------------------
  if (order) {
    const orderId = order?.id;
    const email = order?.email_notification;
    const price = Number.parseFloat(order?.fee);
    console.log(
      `--> new order ID ${orderId} for ${email} with compensation ${price} PLN appeared`
    );

    // -------------------- ACCEPT ORDER IF THE COMPENSATION IS WORTH IT --------------------
    if (price >= Number.parseFloat(process.env.MIN_PRICE)) {
      const assignResponse = await assignOrder(auth, orderId);

      if (assignResponse?.assigned_at) {
        console.log(
          `--> order ID ${orderId} assigned successfully at ${assignResponse?.assigned_at}))\n`
        );
      } else {
        console.log(`--> order ID ${orderId} assign process has failed!!\n`);
      }
    } else {
      console.log(`--> order ID ${orderId} rejected due to low compensation\n`);
    }
  } else {
    console.log(
      `--> order is not available, maybe a order is already in progress :(\n`
    );
  }

  return;
}

async function getAccessToken() {
  const body = {
    client_id: process.env.AUTH_CLIENT_ID,
    client_secret: process.env.AUTH_CLIENT_SECRET,
    grant_type: "password",
    username: process.env.AUTH_EMAIL_ADDRESS,
    password: process.env.AUTH_PASSWORD,
  };
  const headers = {
    ...getHeaders(),
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": Buffer.byteLength(
      new URLSearchParams(body).toString(),
      "utf-8"
    ).toString(),
  };

  try {
    const response = await axios.post(process.env.URL_GET_TOKEN, body, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("--> !!!error during authentication:", error.message);
    throw error;
  }
}

async function getOrders(auth) {
  const headers = getHeaders(auth);

  try {
    const response = await axios.get(process.env.URL_GET_ORDERS, { headers });
    return response.data;
  } catch (error) {
    console.error("--> !!!error obtaining order data:", error.message);
    throw error;
  }
}

async function assignOrder(auth, orderId) {
  const body = { order_translator_role: "translator" };
  const headers = {
    ...getHeaders(auth),
    "Content-Type": "application/json;charset=UTF-8",
    "Content-Length": Buffer.byteLength(
      JSON.stringify(body),
      "utf-8"
    ).toString(),
  };
  const replaceId = (string, id) => string.replace("{{id}}", id);

  try {
    const response = await axios.patch(
      replaceId(process.env.URL_ASSIGN_ORDER, orderId),
      body,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("--> !!!error assigning order:", error.message);
    throw error;
  }
}

module.exports = {
  startAssignProcess,
};
