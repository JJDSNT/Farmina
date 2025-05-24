// api/specialcares.js

const { getCountry, getLanguageId, fetchFarminaApi } = require("../lib/farmina");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    console.warn("[/api/specialcares] Método não permitido:", req.method);
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const payload = {
      species: req.body?.species || "dog",
      country: getCountry(),
      languageId: getLanguageId(req),
      type: req.body?.type || "dietetic"
    };

    const endpoint = process.env.SPECIALCARES_ENDPOINT;
    console.log("[/api/specialcares] Enviando para API externa:", {
      endpoint,
      payload
    });

    const data = await fetchFarminaApi({ endpoint, payload });

    console.log("[/api/specialcares] Resposta da API externa:", {
      status: data?.status,
      keys: data && typeof data === "object" ? Object.keys(data) : null
    });

    res.status(200).json(data);
  } catch (err) {
    console.error("[/api/specialcares] Erro:", err);
    res.status(500).json({ error: err.message || "Erro interno." });
  }
};

