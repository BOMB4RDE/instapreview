export default async function handler(req, res) {
  const { NOTION_TOKEN, DATABASE_ID } = process.env;

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        // TRI CHRONOLOGIQUE : Plus récent en premier
        sorts: [
          {
            timestamp: "created_time",
            direction: "descending"
          }
        ]
      }),
    });

    const data = await response.json();
    const posts = data.results.map(page => {
      const mediaProp = page.properties.Media || page.properties.media;
      const files = mediaProp?.files || [];
      if (files.length === 0) return null;
      return {
        id: page.id,
        url: files.map(f => f.file?.url || f.external?.url),
        date: page.created_time // On garde la date pour le futur swap
      };
    }).filter(post => post !== null);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
