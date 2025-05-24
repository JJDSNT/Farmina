// api/specialcares.js

import { getCountry, getLanguageId, fetchFarminaApi } from "@/lib/farmina";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  try {
    const payload = {
      species: req.body?.species || "dog",
      country: getCountry(),
      languageId: getLanguageId(req),
      type: req.body?.type || "dietetic"
    };

    const endpoint = process.env.SPECIALCARES_ENDPOINT;
    const data = await fetchFarminaApi({ endpoint, payload });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
