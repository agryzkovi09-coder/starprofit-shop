
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.BOT_TOKEN;
const SUPPORT = process.env.SUPPORT_USERNAME || "StarProfitMoneyBot";

app.get("/", (req, res) => {
  res.send("⭐ StarProfit server is running!");
});

if (TOKEN) {
  const bot = new TelegramBot(TOKEN, { polling: true });

  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "⭐ Добро пожаловать в StarProfit!\n\nВыбери нужный раздел:",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "⭐ Telegram Stars", callback_data: "stars" }],
            [{ text: "🧸 Telegram-подарки", callback_data: "gifts" }],
            [{ text: "💬 Поддержка", callback_data: "support" }]
          ]
        }
      }
    );
  });

  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;

    await bot.answerCallbackQuery(query.id);

    if (query.data === "stars") {
      bot.sendMessage(
        chatId,
        "⭐ Каталог Telegram Stars\n\nСкоро здесь появятся доступные предложения и цены."
      );
    }

    if (query.data === "gifts") {
      bot.sendMessage(
        chatId,
        "🧸 Каталог Telegram-подарков\n\nСкоро здесь появятся доступные подарки."
      );
    }

    if (query.data === "support") {
      bot.sendMessage(
        chatId,
        "💬 Нужна помощь? Напиши нашей команде поддержки:",
        {
          reply_markup: {
            inline_keyboard: [[
              {
                text: "Открыть поддержку",
                url: "https://t.me/" + SUPPORT.replace("@", "")
              }
            ]]
          }
        }
      );
    }
  });

  bot.on("polling_error", (error) => {
    console.log("Telegram error:", error.message);
  });

  console.log("StarProfit Telegram bot started");
} else {
  console.log("BOT_TOKEN is not configured");
}

app.listen(PORT, "0.0.0.0", () => {
  console.log("StarProfit server listening on port " + PORT);
});
