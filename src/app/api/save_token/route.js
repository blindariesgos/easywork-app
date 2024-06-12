export default async function handler(req, res) {
  console.log(req.method);
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  console.log(req.body);

  res.status(200).json(true);
}
