export default async function handler(req, res) {
  // On utilise directement tes valeurs pour être sûr à 100%
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = process.env.DATABASE_ID;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Security-Policy', 'frame-ancestors *');

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // C'est ici qu'on va voir si Notion dit "401 Unauthorized" ou "404 Not Found"
      return res.status(response.status).json({ 
        error: `Notion dit: ${data.message}`,
        code: data.code 
      });
    }

    const posts = data.results.map(page => {
      // On cherche la colonne "Media" (vue sur ta capture)
      const mediaProp = page.properties.Media || page.properties.media;
      const files = mediaProp?.files || [];
      
      if (files.length === 0) return null;

      return {
        id: page.id,
        url: files.map(f => f.file?.url || f.external?.url)
      };
    }).filter(post => post !== null);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Crash Serveur: " + error.message });
  }
}
