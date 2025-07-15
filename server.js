const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Static public folder
app.use(express.static(path.join(__dirname, "public")));

// Optional: fallback if URL format is /slug
app.get("/:slug", (req, res) => {
  const filePath = path.join(__dirname, "public", req.params.slug, "index.html");
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send("404: Not Found");
  });
});

// Start bot
require("./bot");

app.listen(PORT, () => {
  console.log(`🌐 Server jalan di port ${PORT}`);
});
