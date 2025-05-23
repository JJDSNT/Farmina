export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const API_ENDPOINT = process.env.SPECIALCARES_ENDPOINT || 'https://gw-c.petgenius.info/wfservice/z1/specialcares/list';
  const username = process.env.AUTH_USER || 'wsfarmina_zendesk';
  const password = process.env.AUTH_PASS || 'test';
  
  let { species, languageId, type } = req.body || {};
  
  // Usar defaults do briefing se não vierem no body
  const payload = {
    species: species || "dog", // default para dog se não especificado
    country: process.env.COUNTRY || "MA", // sempre usar o country padrão
    languageId: languageId || "1", // default do briefing
    type: type || "dietetic" // default do briefing
  };
  
  console.log("Payload enviado para Specialcares:", payload);
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
      body: JSON.stringify(payload),
    });
    
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      return res.status(response.status).json({ 
        error: "Erro na API Specialcares", 
        status: response.status,
        statusText: response.statusText 
      });
    }
    
    const data = await response.json();
    console.log("Resposta da API Specialcares:", data);
    
    res.status(200).json(data);
    
  } catch (err) {
    console.error("Erro na requisição:", err);
    res.status(500).json({ 
      error: "Erro ao consultar specialcares", 
      details: err.message 
    });
  }
}
