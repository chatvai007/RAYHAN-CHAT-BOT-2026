
module.exports.config = {
 name: "fork",
 version: "2.0.6",
 hasPermssion: 0,
 credits: "Rayhan",
 description: "Boss contact information",
 commandCategory: "other",
 usages: "fork",
 cooldowns: 3,
};

module.exports.run = async function({ api, event }) {

 const msg = `
━━━━━━━━━━━━━━━━━━━━━━
👑 𝗕𝗢𝗦𝗦 𝗔𝗥 𝗙𝗢𝗥𝗞
━━━━━━━━━━━━━━━━━━━━━━

⚠️ Fork নিতে হলে আগে
আমার Boss-কে মেসেজ দিন।

👑 𝗕𝗢𝗦𝗦 : Rayhan

📩 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗕𝗢𝗦𝗦:
https://www.facebook.com/share/1F2Xp64Huj/

━━━━━━━━━━━━━━━━━━━━━━
❤️ 𝗧𝗛𝗔𝗡𝗞𝗦
━━━━━━━━━━━━━━━━━━━━━━
`;

 return api.sendMessage(msg, event.threadID, event.messageID);
};
