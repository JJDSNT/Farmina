
// api/products.js

import { getCountry, getLanguageId, fetchFarminaApi } from "@/lib/farmina";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST")
    return res.status(405).json({ error: "Método não permitido." });

  try {
    const { type, productType, lifeStage, gestation = false, lactation = false, specialcares = "" } =
      req.method === "GET" ? req.query : req.body || {};

    const payload = {
      type,
      productType,
      lifeStage,
      gestation: gestation === "true" || gestation === true,
      lactation: lactation === "true" || lactation === true,
      specialcares: (typeof specialcares === "string" && specialcares)
        ? specialcares.split(",").map(Number).filter(n => !isNaN(n))
        : [],
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
