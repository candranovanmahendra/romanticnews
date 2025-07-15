const { Telegraf } = require("telegraf");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const bot = new Telegraf("ISI_TOKEN_BOT_KAMU"); // Ganti token bot kamu
const TEMPLATE_PATH = path.join(__dirname, "template.html");
const OUTPUT_DIR = path.join(__dirname, "public");

function generateSlug(length = 8) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

bot.start((ctx) => {
  ctx.reply("Kirim link iframe YouTube (atau sejenis) untuk dibuatkan halaman.");
});

bot.on("text", async (ctx) => {
  const inputUrl = ctx.message.text;
  const userId = ctx.from.id.toString();

  if (!inputUrl.startsWith("http")) {
    return ctx.reply("⚠️ Kirim URL valid, contoh: https://youtube.com/embed/...");
  }

  const slug = generateSlug();
  const userDir = path.join(OUTPUT_DIR, slug);
  const outputFile = path.join(userDir, "index.html");

  try {
    const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");
    const html = template
      .replace(/{{URL}}/g, inputUrl)
      .replace(/{{USER_ID}}/g, userId);

    fs.mkdirSync(userDir, { recursive: true });
    fs.writeFileSync(outputFile, html);

    const finalUrl = `https://canvev.store/${slug}`;
    ctx.reply(`✅ Link kamu siap:\n${finalUrl}`);
  } catch (err) {
    console.error("❌ Error:", err);
    ctx.reply("❌ Gagal membuat halaman.");
  }
});

bot.launch();
console.log("🤖 Bot jalan!");
