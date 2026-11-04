
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "RAYHAN",
  description: "Shows all commands with details",
  commandCategory: "system",
  usages: "[command name/page number]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

// Mathematical Bold Font Converter
function toBold(text) {
  const boldMap = {
    'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴',
    'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹',
    'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾',
    'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃',
    'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈',
    'Z': '𝚉',
    'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎',
    'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓',
    'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘',
    'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝',
    'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢',
    'z': '𝚣',
    '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹',
    '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽',
    '8': '𝟾', '9': '𝟿'
  };

  return String(text).split('').map(ch => boldMap[ch] || ch).join('');
}

// Get group prefix
function getPrefix(threadID) {
  const threadSetting =
    global.data.threadData.get(parseInt(threadID)) || {};

  return threadSetting.PREFIX || global.config.PREFIX || "";
}

// Help command language
module.exports.languages = {
  en: {
    moduleInfo: `╔══════════════════════╗
║ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨ ║
╠══════════════════════╣
║
║ 🔖 𝐍𝐚𝐦𝐞 ⇢ %1
║ 📄 𝐔𝐬𝐚𝐠𝐞 ⇢ %2
║ 📜 𝐃𝐞𝐬𝐜 ⇢ %3
║ 🔑 𝐏𝐞𝐫𝐦 ⇢ %4
║ 👨‍💻 𝐂𝐫𝐞𝐝𝐢𝐭 ⇢ %5
║ 📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 ⇢ %6
║ ⏳ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧 ⇢ %7s
║
╠══════════════════════╣
║ ⚙ 𝐏𝐫𝐞𝐟𝐢𝐱 ⇢ %8
║ 🤖 𝐁𝐨𝐭 ⇢ %9
║ 👑 𝐎𝐰𝐧𝐞𝐫 ⇢ 𝙍𝙰𝚈𝙷𝙰𝙽
╚══════════════════════╝`,

    helpList: "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]",
    user: "User",
    adminGroup: "Admin Group",
    adminBot: "Admin Bot"
  }
};

// Help image
const helpImages = [
  "https://i.imgur.com/MkTK40j.jpeg"
];

// Download image
function downloadImages(callback) {
  const randomUrl =
    helpImages[Math.floor(Math.random() * helpImages.length)];

  const cacheDir = path.join(__dirname, "cache");
  const filePath = path.join(cacheDir, "help_random.jpg");

  fs.ensureDirSync(cacheDir);

  request(randomUrl)
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => callback([filePath]))
    .on("error", () => callback([]));
}

// Send help image and message
function sendHelp(api, threadID, messageID, body) {
  downloadImages(files => {
    const attachments = files.map(file =>
      fs.createReadStream(file)
    );

    api.sendMessage(
      {
        body,
        attachment: attachments
      },
      threadID,
      () => {
        files.forEach(file => {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        });
      },
      messageID
    );
  });
}

// Help event
module.exports.handleEvent = function ({
  api,
  event,
  getText
}) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body) return;

  const lowerBody = body.trim().toLowerCase();
  const prefix = global.config.PREFIX || "";

  let args = null;

  if (prefix && lowerBody.startsWith(
    (prefix + "help ").toLowerCase()
  )) {
    args = body.trim()
      .slice(prefix.length)
      .trim()
      .split(/\s+/)
      .slice(1);
  } else if (lowerBody.startsWith("help ")) {
    args = body.trim().split(/\s+/).slice(1);
  } else {
    return;
  }

  if (!args[0] || !commands.has(args[0].toLowerCase())) return;

  const command = commands.get(args[0].toLowerCase());
  const pfx = getPrefix(threadID);

  const detail = getText(
    "moduleInfo",
    toBold(command.config.name),
    toBold(command.config.usages || "Not Provided"),
    toBold(command.config.description || "Not Provided"),
    toBold(command.config.hasPermssion),
    toBold(command.config.credits || "RAYHAN"),
    toBold(command.config.commandCategory || "Unknown"),
    toBold(command.config.cooldowns || 0),
    toBold(pfx || "no-prefix"),
    toBold(global.config.BOTNAME || "RAYHAN")
  );

  sendHelp(api, threadID, messageID, detail);
};

// Main help command
module.exports.run = function ({
  api,
  event,
  args,
  getText
}) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const prefix = getPrefix(threadID);

  // Specific command information
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const command = commands.get(args[0].toLowerCase());

    const detailText = getText(
      "moduleInfo",
      toBold(command.config.name),
      toBold(command.config.usages || "Not Provided"),
      toBold(command.config.description || "Not Provided"),
      toBold(command.config.hasPermssion),
      toBold(command.config.credits || "RAYHAN"),
      toBold(command.config.commandCategory || "Unknown"),
      toBold(command.config.cooldowns || 0),
      toBold(prefix || "no-prefix"),
      toBold(global.config.BOTNAME || "RAYHAN")
    );

    sendHelp(api, threadID, messageID, detailText);
    return;
  }

  // All commands list
  const arrayInfo = Array.from(commands.keys())
    .filter(cmdName => cmdName && cmdName.trim() !== "")
    .sort();

  const page = Math.max(parseInt(args[0]) || 1, 1);
  const numberOfOnePage = 100;

  const totalPages = Math.max(
    1,
    Math.ceil(arrayInfo.length / numberOfOnePage)
  );

  const start = numberOfOnePage * (page - 1);

  const helpView = arrayInfo.slice(
    start,
    start + numberOfOnePage
  );

  // Numbered command list
  const msg = helpView.map((cmdName, i) => {
    const num = toBold(
      String(start + i + 1).padStart(3, "0")
    );

    return `║ ${num} ➤ ${toBold(cmdName)}`;
  }).join("\n");

  const displayPrefix = prefix || "(no prefix)";

  const text = `╔══════════════════════╗
║ 📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 📜 ║
╠══════════════════════╣
║ 📄 𝐏𝐚𝐠𝐞 ⇢ ${toBold(page)}/${toBold(totalPages)}
║ 🧮 𝐓𝐨𝐭𝐚𝐥 ⇢ ${toBold(arrayInfo.length)}
║ 📦 𝐒𝐡𝐨𝐰𝐢𝐧𝐠 ⇢ ${toBold(helpView.length)}
╠══════════════════════╣
${msg}
╠══════════════════════╣
║ ⚙ 𝐏𝐫𝐞𝐟𝐢𝐱 ⇢ ${toBold(displayPrefix)}
║ 🤖 𝐁𝐨𝐭 ⇢ ${toBold(global.config.BOTNAME || "RAYHAN")}
║ 👑 𝐎𝐰𝐧𝐞𝐫 ⇢ 𝙍𝙰𝚈𝙷𝙰𝙽
╠══════════════════════╣
║ 💡 ${toBold("help <name>")} ⇢ 𝐃𝐞𝐭𝐚𝐢𝐥𝐬
║ 📄 ${toBold("help " + (page + 1))} ⇢ 𝐍𝐞𝐱𝐭 𝐏𝐚𝐠𝐞
╚══════════════════════╝`;

  sendHelp(api, threadID, messageID, text);
};
              
