// lib/farmina.js

// Erro claro se variável de ambiente sensível estiver ausente
export function getEnvOrFail(varName) {
  const value = process.env[varName];
  if (!value) throw new Error(`Variável de ambiente obrigatória não definida: ${varName}`);
  return value;
}

// Centralização do país
export function getCountry() {
  return getEnvOrFail("COUNTRY");
}

// Centralização do idioma: ajuste conforme sua regra de negócio
export function getLanguageId(req) {
  // Exemplo flexível: aceita de body/query, senão pega do env
  return req?.body?.languageId
    || req?.query?.languageId
    || process.env.LANGUAGE_ID
    || "1";
  // Se quiser sempre fixo, só: return process.env.LANGUAGE_ID || "1";
}

// Auth seguro e centralizado
export function getAuthHeader() {
  const user = getEnvOrFail("AUTH_USER");
  const pass = getEnvOrFail("AUTH_PASS");
  return "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
}

// Fetch seguro (com headers, etc)
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
