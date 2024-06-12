export async function POST(req) {
  try {
    const { token } = await req.json();

    console.log(token);

    return Response.json(true);
  } catch (error) {
    return Response.json(false);
  }
}
