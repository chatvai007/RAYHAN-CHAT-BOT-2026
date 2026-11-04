
const axios = global.nodemodule["axios"];
const fs = global.nodemodule["fs-extra"];
const path = require("path");

module.exports.config = {
  name: "bday",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "RAYHAN",
  description: "See Admin Rayhan's Birthday",
  usePrefix: false,
  commandCategory: "info",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {

  // Rayhan's Birthday
  const targetDate = new Date("August 09, 2027 00:00:00");
  const now = new Date();

  const diffMs = targetDate - now;

  const diffDays = Math.floor(
    diffMs / (1000 * 60 * 60 * 24)
  );

  const diffHours = Math.floor(
    (diffMs / (1000 * 60 * 60)) % 24
  );

  const diffMinutes = Math.floor(
    (diffMs / (1000 * 60)) % 60
  );

  const diffSeconds = Math.floor(
    (diffMs / 1000) % 60
  );

  // Tomorrow Birthday
  if (diffDays === 1) {
    const tomorrowMessage =
`🎉 আগামীকাল আমাদের প্রিয় Admin RAYHAN-এর জন্মদিন! 🎂

🥰 সবাই উইশ করতে ভুলবে না!
❤️ আগাম শুভ জন্মদিন RAYHAN!`;

    return api.sendMessage(
      tomorrowMessage,
      event.threadID,
      event.messageID
    );
  }

  // Birthday Today
  if (diffDays === 0) {
    const happyBirthdayMessage =
`╔═══ 🎉 𝐇𝐀𝐏𝐏𝐘 𝐁𝐈𝐑𝐓𝐇𝐃𝐀𝐘 🎉 ═══╗
║
║ 👑 𝐎𝐔𝐑 𝐁𝐎𝐒𝐒 - 𝐑𝐀𝐘𝐇𝐀𝐍 ❤️
║
║ 🎂 Everyone Please Wish Him Today!
║ 🥳 আজ আমাদের Boss-এর জন্মদিন!
║ ❤️ সবাই মন থেকে উইশ করো!
║
╠═══════════════════════
║ 📩 𝐂𝐎𝐍𝐍𝐄𝐂𝐓 𝐖𝐈𝐓𝐇 𝐇𝐈𝐌
║
║ 📘 Facebook:
║ https://www.facebook.com/share/1F2Xp64Huj/
║
║ 📱 WhatsApp:
║ https://wa.me/8801638759227
║
╠═══════════════════════
║ 🫶 উইশ করো, দোয়া করো!
║ ❤️ ভালোবাসা জানাও প্রিয় RAYHAN-কে!
╚═══════════════════════╝`;

    return api.sendMessage(
      happyBirthdayMessage,
      event.threadID,
      event.messageID
    );
  }

  // Birthday Already Passed
  if (diffDays < 0) {
    const leakMessage =
`╔══════════════════════════╗
║ 🎂 ADMIN RAYHAN
║ ❤️‍🩹 এর জন্মদিন শেষ হয়ে গেছে!
║
║ 👑 আমাদের Boss RAYHAN
║ 🥳 Happy Birthday!
╚══════════════════════════╝`;

    return api.sendMessage(
      leakMessage,
      event.threadID,
      event.messageID
    );
  }

  // Countdown
  const countdownMessage =
`╔══════════════════════════╗
║ 🎂 ADMIN RAYHAN
║ ❤️‍🩹 এর জন্মদিন আসছে!
╠══════════════════════════╣
║ 📅 Days    : ${diffDays}
║ ⏰ Hours   : ${diffHours}
║ 🕰️ Minutes : ${diffMinutes}
║ ⏳ Seconds : ${diffSeconds}
╠══════════════════════════╣
║ 👑 POWERED BY RAYHAN
╚══════════════════════════╝`;

  const url = "https://graph.facebook.com/61575698041722/picture?height=720&width=720";
  const cacheDir = path.join(__dirname, "cache");
  const imagePath = path.join(cacheDir, "bday.png");

  try {
    fs.ensureDirSync(cacheDir);

    const response = await axios({
      url,
      method: "GET",
      responseType: "arraybuffer",
      timeout: 20000
    });

    fs.writeFileSync(imagePath, Buffer.from(response.data));

    return api.sendMessage(
      {
        body: countdownMessage,
        attachment: fs.createReadStream(imagePath)
      },
      event.threadID,
      () => {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      },
      event.messageID
    );

  } catch (error) {
    console.log("Birthday image error:", error.message);

    return api.sendMessage(
      countdownMessage,
      event.threadID,
      event.messageID
    );
  }
};
