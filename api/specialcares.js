export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const API_ENDPOINT = process.env.SPECIALCARES_ENDPOINT || 'https://gw-c.petgenius.info/wfservice/z1/specialcares/list';
  const username = process.env.AUTH_USER || 'wsfarmina_zendesk';
  const password = process.env.AUTH_PASS || 'test';
  
  let { species, languageId, type } = req.body || {};
  
  const payload = {
    species: species || "dog",
    country: process.env.COUNTRY || "MA",
    languageId: languageId || "1",
    type: type || "dietetic"
  };
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: "Erro na API Specialcares", 
        status: response.status,
        statusText: response.statusText
      });
    }
    
    const data = await response.json();
    res.status(200).json(data);
    
  } catch (err) {
    res.status(500).json({ 
      error: "Erro ao consultar specialcares", 
      details: err.message 
    });
  }
}
