require('dotenv').config();
const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate environment variables
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('Error: TELEGRAM_BOT_TOKEN is missing in .env file');
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is missing in .env file');
  process.exit(1);
}

// Initialize Telegram Bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using gemini-2.5-pro as requested
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

// Start command
bot.start((ctx) => {
  ctx.reply('Welcome! I am a bot powered by Google Gemini. Send me a message and I will reply.');
});

// Help command
bot.help((ctx) => {
  ctx.reply('Just send me a text message and I will try to answer it using Gemini AI.');
});

// Handle text messages
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  // Show typing status
  ctx.sendChatAction('typing');

  try {
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    // Split message if it's too long (Telegram limit is 4096)
    const MAX_LENGTH = 4096;
    for (let i = 0; i < text.length; i += MAX_LENGTH) {
      const chunk = text.substring(i, i + MAX_LENGTH);
      await ctx.reply(chunk);
    }
  } catch (error) {
    console.error('Error generating content:', error);
    ctx.reply('Sorry, I encountered an error while processing your request.');
  }
});

// Launch the bot
bot.launch().then(() => {
  console.log('Bot is running...');
}).catch((err) => {
  console.error('Failed to launch bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
