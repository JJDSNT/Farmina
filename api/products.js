// api/products.js

import { getCountry, getLanguageId, fetchFarminaApi } from "@/lib/farmina";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método não permitido." });

  try {
    // Recebe todos os campos do formulário
    const {
      type,
      productType,
      lifeStage,
      gestation = false,
      lactation = false,
      specialcares = []
    } = req.body || {};

    const specialcaresArray = Array.isArray(specialcares)
      ? specialcares.map(Number).filter(n => !isNaN(n))
      : typeof specialcares === "string" && specialcares
        ? [Number(specialcares)].filter(n => !isNaN(n))
        : [];

    const payload = {
      type,
      productType,
      lifeStage,
      gestation: gestation === "true" || gestation === true,
      lactation: lactation === "true" || lactation === true,
      specialcares: specialcaresArray,
      country: getCountry(),
      languageId: getLanguageId(req),
    };

    const endpoint = process.env.API_ENDPOINT;
    const data = await fetchFarminaApi({ endpoint, payload });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
