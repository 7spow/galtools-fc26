// GalTools FC26 - Background Service Worker (Manifest V3)
// Gere les appels API securises vers Anthropic (cle jamais exposee au frontend)

chrome.runtime.onInstalled.addListener(() => {
  console.log('GalTools FC26 installed - L\'assistant du peuple');
});

// Listener pour les messages depuis le popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHAT_REQUEST') {
    handleChatRequest(request.payload)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // async response
  }
  
  if (request.type === 'GET_FUT_DATA') {
    fetchFutData(request.query)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});

async function handleChatRequest({ message, apiKey }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: `Tu es GalTools, l'assistant FC26 du peuple. Tu connais tout sur FC26 / FUT26 :
- Meta du moment, formations, joueurs OP
- SBC rentables et solutions optimales
- Prix du marche et tendances
- Investissements et conseils coins
Reponds de facon concise, precise et utile. Utilise des emojis FC pertinents.`,
      messages: [{ role: 'user', content: message }]
    })
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Erreur API');
  return data.content[0].text;
}

async function fetchFutData(query) {
  // Proxy vers Vercel backend pour eviter CORS
  const VERCEL_API = 'https://galtools-fc26.vercel.app/api/fut';
  const response = await fetch(`${VERCEL_API}?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Erreur FUT data');
  return response.json();
}
