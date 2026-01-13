import { API_SECRET, API_TOKEN, generateSignature, VERIF_URL } from "../utils";

export async function GET(_: Request) {
  const payload = {
    verification: {
      callback: "https://veriff-poc.vercel.app/success",
      document: {
        country: "AU",
      },
    },
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
