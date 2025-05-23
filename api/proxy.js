
// api/proxy.js
export default async function handler(req, res) {
  const endpoint = process.env.API_ENDPOINT;
  const username = process.env.AUTH_USER;
  const password = process.env.AUTH_PASS;

  if (!endpoint || !username || !password) {
    return res.status(500).json({ error: "Variáveis de ambiente não configuradas." });
  }

  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Erro da API externa." });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao chamar a API:", err);
    res.status(500).json({ error: "Erro interno no servidor proxy." });
  }
}
