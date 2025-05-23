// pages/api/specialcares.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const country = process.env.COUNTRY || 'MA';
  const username = process.env.AUTH_USER;
  const password = process.env.AUTH_PASS;

  const payload = await req.json();

  const body = {
    country,
    species: payload.species || 'dog',
    languageId: "1",
    type: payload.type || 'dietetic'
  };

  try {
    const response = await fetch('https://gw-c.petgenius.info/wfservice/z1/specialcares/list', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao consultar specialcares', error: err.message });
  }
}
