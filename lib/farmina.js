// lib/farmina.js

function getCountry(req) {
  // Dá prioridade ao valor enviado pelo frontend (body), se existir
  return req?.body?.country || process.env.COUNTRY;
}

function getLanguageId(req) {
  return req.body?.languageId || process.env.LANGUAGE_ID || "1";
}

function getAuthHeader() {
  const user = process.env.AUTH_USER;
  const pass = process.env.AUTH_PASS;
  if (!user || !pass) throw new Error("Usuário/senha não definidos");
  return "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
}

async function fetchFarminaApi({ endpoint, payload }) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
  return response.json();
}

module.exports = { getCountry, getLanguageId, fetchFarminaApi };
