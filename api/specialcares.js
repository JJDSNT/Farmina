export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Tentar diferentes URLs possíveis
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
  
  console.log("=== DEBUG INFO ===");
  console.log("API_ENDPOINT:", API_ENDPOINT);
  console.log("Username:", username);
  console.log("Payload:", payload);
  
  try {
    // Primeiro, vamos tentar GET para ver se o endpoint existe
    console.log("Testando conexão com a API...");
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST', // Manter POST como no briefing
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
      body: JSON.stringify(payload),
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      // Se 404, vamos tentar algumas variações da URL
      if (response.status === 404) {
        console.log("Tentando URLs alternativas...");
        
        const alternativeUrls = [
          'https://gw-c.petgenius.info/wfservice/z1/specialcares',
          'https://gw-c.petgenius.info/wfservice/specialcares/list',
          'https://gw-c.petgenius.info/specialcares/list'
        ];
        
        for (const altUrl of alternativeUrls) {
          console.log(`Tentando: ${altUrl}`);
          try {
            const altResponse = await fetch(altUrl, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
              },
              body: JSON.stringify(payload),
            });
            
            if (altResponse.ok) {
              const data = await altResponse.json();
              console.log(`Sucesso com URL: ${altUrl}`);
              return res.status(200).json(data);
            }
          } catch (e) {
            console.log(`Falhou com ${altUrl}:`, e.message);
          }
        }
      }
      
      return res.status(response.status).json({ 
        error: "Erro na API Specialcares", 
        status: response.status,
        statusText: response.statusText,
        url: API_ENDPOINT
      });
    }
    
    const data = await response.json();
    console.log("Resposta da API Specialcares:", data);
    
    res.status(200).json(data);
    
  } catch (err) {
    console.error("Erro na requisição:", err);
    res.status(500).json({ 
      error: "Erro ao consultar specialcares", 
      details: err.message,
      url: API_ENDPOINT
    });
  }
}
