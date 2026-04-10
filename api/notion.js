export default async function handler(req, res) {
  const { NOTION_TOKEN, DATABASE_ID } = process.env;
  res.setHeader('Access-Control-Allow-Origin', '*');

  // CAS 1 : MISE À JOUR (PATCH) - Appelé lors du Drag & Drop
  if (req.method === 'PATCH') {
    const { pageId, newDate } = req.body;
    try {
      const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          properties: {
            'Date': { date: { start: newDate } }
          }
        }),
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // CAS 2 : RÉCUPÉRATION (POST/GET) - Ton code actuel trié par Date
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        sorts: [{ property: "Date", direction: "descending" }]
      }),
    });

    const data = await response.json();
    const posts = data.results.map(page => {
      const mediaProp = page.properties.Media || page.properties.media;
      const dateProp = page.properties.Date?.date?.start;
      const files = mediaProp?.files || [];
      if (files.length === 0) return null;
      return {
        id: page.id,
        url: files.map(f => f.file?.url || f.external?.url),
        date: dateProp // On garde la date pour l'échange
      };
    }).filter(post => post !== null);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
