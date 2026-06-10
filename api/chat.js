// GalTools FC26 - Vercel Serverless API
// Route: POST /api/chat
// Proxy securise vers Anthropic (cle API cote serveur uniquement)

export default async function handler(req, res) {
  // CORS pour extension Chrome
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { message, userId } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message requis' });
  }
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        system: `Tu es GalTools, l'assistant FC26 du peuple. Expert absolu de FC26 / FUT26.
Meta, SBC, marche, investissements - tu reponds toujours avec des donnees precises et a jour.
Style: concis, direct, avec emojis pertinents.`,
        messages: [{ role: 'user', content: message }]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur Anthropic');
    }
    
    // Log dans Supabase si userId fourni
    if (userId && process.env.SUPABASE_URL) {
      await logToSupabase(userId, message, data.content[0].text);
    }
    
    return res.status(200).json({
      reply: data.content[0].text,
      usage: data.usage
    });
    
  } catch (error) {
    console.error('GalTools API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function logToSupabase(userId, question, answer) {
  try {
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/chat_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        user_id: userId,
        question,
        answer,
        created_at: new Date().toISOString()
      })
    });
  } catch (e) {
    console.error('Supabase log error:', e);
  }
}
