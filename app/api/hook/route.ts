import crypto from "crypto";

const API_SECRET = process.env.API_SECRET || "";

function generateSignature(payload: string | object, secret: string) {
  let payloadString: string;
  if (typeof payload === "object") {
    payloadString = JSON.stringify(payload);
  } else {
    payloadString = payload;
  }

  const signature = crypto.createHmac("sha256", secret);
  signature.update(payloadString);
  return signature.digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json();
  const receivedSignature = request.headers.get("x-hmac-signature");

  if (!receivedSignature) {
    return Response.json({ error: "Signature is missing" }, { status: 401 });
  }

  // Generate expected signature using the same method
  const expectedSignature = generateSignature(body, API_SECRET);

  // Verify signature using constant-time comparison to prevent timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(expectedSignature)
  );

  if (!isValid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  console.log("signature verified successfully");
  console.log("body", body);

  return Response.json({}, { status: 200 });
}
