// lib/farmina.js

export function getEnvOrFail(varName) {
  const value = process.env[varName];
  if (!value) throw new Error(`Variável de ambiente obrigatória não definida: ${varName}`);
  return value;
}

export function getCountry() {
  return getEnvOrFail("COUNTRY");
}

export function getLanguageId(req) {
  // Flexível: aceita do req.body, depois do req.query, depois do env, senão '1'
  return req?.body?.languageId
    || req?.query?.languageId
    || process.env.LANGUAGE_ID
    || "1";
}

export function getAuthHeader() {
  const user = getEnvOrFail("AUTH_USER");
  const pass = getEnvOrFail("AUTH_PASS");
  return "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
}

export async function fetchFarminaApi({ endpoint, method = "POST", payload }) {
  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro da API externa: ${text}`);
  }
  return response.json();
}
