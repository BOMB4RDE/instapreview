export default async function handler(req, res) {
  const { NOTION_TOKEN, DATABASE_ID } = process.env;

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
      body: JSON.stringify({
        // MODIFICATION : On trie par la propriété "Date" du calendrier
        sorts: [
          {
            property: "Date",
            direction: "descending"
          }
        ]
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message });

    const posts = data.results.map(page => {
      const mediaProp = page.properties.Media || page.properties.media;
      const dateProp = page.properties.Date?.date?.start; // On récupère la date du calendrier
      const files = mediaProp?.files || [];
      
      if (files.length === 0) return null;
      
      return {
        id: page.id,
        url: files.map(f => f.file?.url || f.external?.url),
        date: dateProp || page.created_time // Priorité à la date du calendrier
      };
    }).filter(post => post !== null);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
