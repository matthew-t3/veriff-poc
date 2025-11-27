import crypto from "node:crypto";

export const VERIF_URL = "https://api.veriff.me/v1";

export const API_TOKEN = process.env.API_TOKEN || "";
export const API_SECRET = process.env.API_SECRET || "";

export function generateSignature(payload: any, secret: string) {
  if (payload.constructor === Object) {
    payload = JSON.stringify(payload);
  }

  // if (payload.constructor !== Buffer) {
  //   console.log("here?");
  //   payload = Buffer.from(payload, "utf8");
  // }

  console.log("payload", payload);

  const signature = crypto.createHmac("sha256", secret);
  signature.update(payload);
  return signature.digest("hex");
}
