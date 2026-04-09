import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const NOTION_TOKEN = "TON_TOKEN_ICI";
const DATABASE_ID = "TON_DATABASE_ID";

app.get("/posts", async (req, res) => {
  const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();

  const posts = data.results.map(page => {
    const props = page.properties;

    return {
      title: props.Title.title[0]?.plain_text || "",
      type: props.Type.select?.name || "image",
      media: props.Media.files.map(f => f.file?.url || f.external?.url),
      description: props.Description.rich_text[0]?.plain_text || ""
    };
  });

  res.json(posts);
});

app.listen(3000, () => console.log("Server running on port 3000"));