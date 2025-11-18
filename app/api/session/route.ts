import crypto from "crypto";
const VERIF_URL = "https://api.veriff.me/v1";
const API_TOKEN = process.env.API_TOKEN || "";
const API_SECRET = process.env.API_SECRET || "";

function generateSignature(payload: any, secret: string) {
  if (payload.constructor === Object) {
    payload = JSON.stringify(payload);
  }

  if (payload.constructor !== Buffer) {
    payload = Buffer.from(payload, "utf8");
  }

  const signature = crypto.createHmac("sha256", secret);
  signature.update(payload);
  return signature.digest("hex");
}

export async function GET(_: Request) {
  const payload = {
    verification: {},
  };

  const response = await fetch(VERIF_URL + "/sessions", {
    method: "POST",
    headers: {
      "x-auth-client": API_TOKEN,
      "x-hmac-signature": generateSignature(payload, API_SECRET),
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    console.log("error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  const data = await response.json();

  console.log(data);

  return Response.json(data);
}
