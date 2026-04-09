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
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message });
    }

    const posts = data.results.map(page => {
      // On cible précisément ta colonne "Media" vue sur ta capture
      const mediaProp = page.properties.Media;
      const files = mediaProp && mediaProp.files ? mediaProp.files : [];
      
      if (files.length === 0) return null;

      return {
        id: page.id,
        // On récupère toutes les URLs pour gérer les carrousels
        url: files.map(f => f.file?.url || f.external?.url)
      };
    }).filter(post => post !== null);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
