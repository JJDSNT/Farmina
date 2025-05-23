export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const API_ENDPOINT = process.env.SPECIALCARES_ENDPOINT;
  const country = process.env.COUNTRY;
  const username = process.env.AUTH_USER;
  const password = process.env.AUTH_PASS;

  let { species, languageId, type } = req.body || {};

  // Preencher com os padrões do backend se não vierem
  const payload = {
    ...(species ? { species } : {}),
    ...(country ? { country } : {}),
    ...(languageId ? { languageId } : {}),
    ...(type ? { type } : {}),
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao consultar specialcares", details: err.message });
  }
}
