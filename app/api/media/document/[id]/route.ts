import {
  API_SECRET,
  API_TOKEN,
  generateSignature,
  VERIF_URL,
} from "../../../utils";

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/media/document/[id]">
) {
  const { id } = await ctx.params;

  const response = await fetch(VERIF_URL + `/media/${id}`, {
    method: "GET",
    headers: {
      "x-auth-client": API_TOKEN,
      "x-hmac-signature": generateSignature(id, API_SECRET),
    },
  });

  if (!response.ok) {
    return Response.json({ error: "Failed to fetch media" }, { status: 500 });
  }

  const blob = await response.blob();

  console.log("blob", blob);

  return new Response(blob, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
