const fetch = require('node-fetch'); // Built into Netlify runtime

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, email, projectType, message } = JSON.parse(event.body);

    // Hardcode your secret tokens safely here on the server side
    const botToken = "YOUR_ACTUAL_BOT_TOKEN_HERE"; 
    const chatId = "YOUR_ACTUAL_CHAT_ID_HERE";     

    const telegramText = `🚀 *New Portfolio Message!*\n\n` +
                         `👤 *Name:* ${name}\n` +
                         `📧 *Email:* ${email}\n` +
                         `📂 *Project:* ${projectType}\n` +
                         `💬 *Message:* ${message}`;

    // Server-to-Server communication (Bypasses CORS completely!)
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramText,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      return { statusCode: 500, body: "Telegram API Error" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notification sent successfully!" })
    };

  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};