import axios from "@/src/lib/axios";

export async function GET(req) {
  const { pathname, searchParams } = new URL(req.url);

  const endpoint = pathname.replace("api/data/", "");

  const params = new URLSearchParams(searchParams).toString();

  console.log("Enviando solicitud", `${endpoint}?${params}`);

  const res = await axios().get(`${endpoint}?${params}`);

  return Response.json(res);
}

export async function PUT(req) {
  const { pathname, searchParams } = new URL(req.url);

  const endpoint = pathname.replace("api/data/", "");

  const params = new URLSearchParams(searchParams).toString();

  console.log("Enviando solicitud", `${endpoint}?${params}`);

  const res = await axios().put(`${endpoint}?${params}`);

  return Response.json(res);
}
