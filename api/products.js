// api/products.js

export default async function handler(req, res) {
  const endpoint = process.env.API_ENDPOINT;
  const username = process.env.AUTH_USER;
  const password = process.env.AUTH_PASS;

  // Aceita GET (query) e POST (body) para flexibilidade
  let params = {};
  if (req.method === "GET") {
    params = req.query || {};
  } else if (req.method === "POST") {
    params = req.body || {};
  } else {
    return res.status(405).json({ error: "Método não permitido. Use GET ou POST." });
  }
  console.log("Recebido do frontend:", req.body);

  // Coleta campos do request (ou use defaults se quiser)
  const {
    type,
    productType,
    lifeStage,
    gestation = false,
    lactation = false,
    specialcares = "",
    languageId,
    country: countryFromReq // <-- novo!
  } = params;

  // Trata specialcares para garantir array numérico
  const specialcaresArray =
    Array.isArray(specialcares)
      ? specialcares.map(Number).filter(n => !isNaN(n))
      : typeof specialcares === "string" && specialcares
        ? specialcares.split(",").map(Number).filter(n => !isNaN(n))
        : [];

  // Define country dinâmico, fallback para process.env.COUNTRY
  const country = countryFromReq || process.env.COUNTRY;

  if (!endpoint || !username || !password || !country) {
    return res.status(500).json({ error: "Variáveis de ambiente não configuradas corretamente." });
  }

  const payload = {
    type,
    productType,
    lifeStage,
    gestation: gestation === "true" || gestation === true,
    lactation: lactation === "true" || lactation === true,
    specialcares: specialcaresArray,
    country,
    languageId: languageId || process.env.LANGUAGE_ID // usa o do env se não vier da requisição
  };

  console.log("Payload montado para API externa:", payload);

  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

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
    console.log("Resposta da API externa:", data);
    console.log(
      "Primeiro produto retornado:",
      JSON.stringify(
        data.result?.products
          ? data.result.products["63"] || Object.values(data.result.products)[0]
          : null,
        null,
        2
      )
    );

    res.status(200).json(data);
  } catch (err) {
    console.error("Erro no proxy:", err);
    res.status(500).json({ error: "Erro interno no proxy." });
  }
}

