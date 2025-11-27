import {
  API_SECRET,
  API_TOKEN,
  generateSignature,
  VERIF_URL,
} from "../../../utils";

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/media/session/[session]">
) {
  const { session } = await ctx.params;

  const response = await fetch(VERIF_URL + `/sessions/${session}/media`, {
    method: "GET",
    headers: {
      "x-auth-client": API_TOKEN,
      "x-hmac-signature": generateSignature(session, API_SECRET),
    },
  });

  const data = await response.json();

  return Response.json(data);
}
