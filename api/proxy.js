
export default async function handler(req, res) {
  const endpoint = process.env.API_ENDPOINT;
  const username = process.env.AUTH_USER;
  const password = process.env.AUTH_PASS;
  const country = process.env.COUNTRY;

  if (!endpoint || !username || !password || !country) {
    return res.status(500).json({ error: "Variáveis de ambiente não configuradas corretamente." });
  }
  
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido. Use GET." });
  }

  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  const {
    type,
    productType,
    lifeStage,
    gestation = "false",
    lactation = "false",
    specialcares = ""
  } = req.query;

  const payload = {
    type,
    productType,
    lifeStage,
    gestation: gestation === "true",
    lactation: lactation === "true",
    specialcares: specialcares
      ? specialcares.split(",").map(s => parseInt(s)).filter(n => !isNaN(n))
      : [],
    country
  };

 try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "Erro da API externa.", details: text });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro no proxy:", err);
    res.status(500).json({ error: "Erro interno no proxy." });
  }
}
