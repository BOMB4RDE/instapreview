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
    
    // On simplifie les données pour notre widget
    const posts = data.results.map(page => {
      const files = page.properties.Images.files; // "Images" doit être le nom de ta colonne Notion
      return {
        id: page.id,
        // Si plusieurs fichiers, on crée un tableau (carrousel), sinon une string
        url: files.length > 1 ? files.map(f => f.file?.url || f.external?.url) : (files[0]?.file?.url || files[0]?.external?.url)
      };
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
