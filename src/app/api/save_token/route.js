import axios from "@/src/lib/axios";

export async function POST(req) {
  try {
    const { token } = await req.json();

    console.log("preparando post token", token);
    const res = await axios().post(`/notify/push/save-token`, {
      token,
    });

    console.log(res, token);

    return Response.json(true);
  } catch (error) {
    return Response.json(false);
  }
}
