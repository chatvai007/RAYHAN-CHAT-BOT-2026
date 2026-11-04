
const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "admin",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "RAYHAN",
  description: "Show Owner Info as Text with Image",
  commandCategory: "info",
  usages: "admin",
  cooldowns: 5
};

const IMAGE_URL = "https://i.imgur.com/elZgt87.jpeg";

// A-Z, a-z, 0-9 Bold Font
function bold(text) {
  return Array.from(String(text)).map(ch => {
    const c = ch.codePointAt(0);

    if (c >= 65 && c <= 90)
      return String.fromCodePoint(0x1D400 + (c - 65));

    if (c >= 97 && c <= 122)
      return String.fromCodePoint(0x1D41A + (c - 97));

    if (c >= 48 && c <= 57)
      return String.fromCodePoint(0x1D7CE + (c - 48));

    return ch;
  }).join("");
}

module.exports.run = async function ({ api, event }) {

  const time = moment()
    .tz("Asia/Dhaka")
    .format("hh:mm:ss A • DD/MM/YYYY");

  const design = `
╔═══════════════════════════╗
║   👑 ${bold("KING RAYHAN")} 👑   ║
╚═══════════════════════════╝

  ┌─❰ 👤 ${bold("IDENTITY")} ❱─┐
  │  🧑 Name     ➺ ${bold("RAYHAN")}
  │  🎭 Nick     ➺ ${bold("RAYHAN")}
  │  🚹 Gender   ➺ ${bold("MALE")}
  │  🎂 Age      ➺ ${bold("20+")}
  │  🎈 Birthday ➺ ${bold("AUGUST 09")}
  │  🕌 Religion ➺ ${bold("ISLAM")}
  │  🏡 Address  ➺ ${bold("CHANDPUR")}
  └───────────────┘

  ┌─❰ 💫 ${bold("ATTITUDE")} ❱─┐
  │  😈 Attitude ➺ ${bold("KING")}
  │  🎮 FreeFire ➺ ${bold("LOVER")}
  │  📚 Study    ➺ ${bold("ON")}
  │  ❤️ Relation ➺ ${bold("SINGLE")}
  └───────────────┘

  ┌─❰ 🌐 ${bold("CONTACT")} ❱─┐
  │  📘 Messenger ➺ ${bold("RAYHAN")}
  │  📱 WhatsApp  ➺ ${bold("NOT SET")}
  │  📸 Instagram ➺ ${bold("NOT SET")}
  │  🎵 TikTok    ➺ ${bold("NOT SET")}
  │  ✈️ Telegram  ➺ ${bold("NOT SET")}
  └───────────────┘

╔═══════════════════════════╗
║  🕒 ${bold(time)}  ║
║  👑 ${bold("POWERED BY RAYHAN")} 👑  ║
╚═══════════════════════════╝
`;

  const cacheDir = __dirname + "/cache";
  const filePath = cacheDir + "/admin.jpg";

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  try {
    const res = await axios.get(IMAGE_URL, {
      responseType: "arraybuffer",
      timeout: 20000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    fs.writeFileSync(filePath, Buffer.from(res.data));

    return api.sendMessage(
      {
        body: design,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      },
      event.messageID
    );

  } catch (e) {
    console.log("Image load failed:", e.message);

    return api.sendMessage(
      design,
      event.threadID,
      event.messageID
    );
  }
};
