const TelegramBotClass = require('node-telegram-bot-api');
const TelegramBot = TelegramBotClass.default || TelegramBotClass;
const fs = require('fs');
const path = require('path');

// Simple .env file parser
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      process.env[key] = value;
    }
  });
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.EXPO_PUBLIC_WEB_APP_URL || 'http://localhost:8081';

if (!token) {
  console.error("ERROR: TELEGRAM_BOT_TOKEN is missing in your .env file!");
  process.exit(1);
}

console.log("Starting Telegram Bot...");
console.log("Web App Base URL:", webAppUrl);

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on('polling_error', (error) => {
  console.error("[Polling Error]", error.message);
});

// Matches "/start [start_parameter]"
bot.onText(/\/start (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const startParam = match[1] ? match[1].trim() : "";
  
  console.log(`[Bot] Received /start command from Chat ID ${chatId} with param: "${startParam}"`);

  if (!startParam) {
    sendWelcomeMessage(chatId);
    return;
  }

  // startParam format: accountId___tableId
  let delimiter = '___';
  if (startParam.includes('___')) delimiter = '___';
  else if (startParam.includes('--')) delimiter = '--';
  else if (startParam.includes('-')) delimiter = '-';

  const parts = startParam.split(delimiter);
  if (parts.length < 2) {
    bot.sendMessage(chatId, "QR-kod formati noto'g'ri. Iltimos, stoldagi QR-kodni qayta skanerlang.");
    return;
  }

  const accountId = parts[0];
  const tableId = parts.slice(1).join(delimiter);

  // Construct target web app url
  const targetUrl = `${webAppUrl}/menu?accountId=${accountId}&tableId=${tableId}`;
  console.log(`[Bot] Formatted WebApp URL: ${targetUrl}`);

  bot.sendMessage(chatId, "Xush kelibsiz! Buyurtma berish uchun pastdagi tugmani bosing: 🍽️", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Menyuni ochish 📖",
            web_app: { url: targetUrl }
          }
        ]
      ]
    }
  });
});

// Handles "/start" with no parameters
bot.onText(/\/start$/, (msg) => {
  const chatId = msg.chat.id;
  console.log(`[Bot] Received /start with no params from Chat ID ${chatId}`);
  sendWelcomeMessage(chatId);
});

function sendWelcomeMessage(chatId) {
  bot.sendMessage(chatId, "Salom! Ushbu bot stolda joylashgan QR-kod orqali restoran menyusini ochish va buyurtma berish uchun xizmat qiladi.\n\nIltimos, stoldagi QR-kodni skaner qiling va botga o'ting.");
}

console.log("Telegram Bot is running successfully!");
