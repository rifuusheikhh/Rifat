module.exports.config = {
  name: "anti18",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rifat",
  description: "Gali warning",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { threadID, messageID, body, senderID } = event;
    if (!body) return;
    if (senderID == api.getCurrentUserID()) return;

    const text = body.toLowerCase();
    const badWords = ["fuck", "bitch", "shit", "porn", "sex", "chud", "chod", "magi", "khanki", "bainchod", "madarchod", "randi", "chutiya", "bal", "harami", "tor mar", "tor maa", "চুদ", "মাগি", "খানকি", "বাল"];
    const badEmojis = ["👄", "🫦", "👅", "💋", "🥵", "🍆", "🍑", "💦"];

    const isGali = badWords.some(w => text.includes(w));
    const isEmoji = badEmojis.some(e => body.includes(e));
    if (!isGali && !isEmoji) return;

    if (!global.anti18Warn) global.anti18Warn = {};
    const key = threadID + "_" + senderID;
    global.anti18Warn[key] = (global.anti18Warn[key] || 0) + 1;
    const count = global.anti18Warn[key];

    return api.sendMessage(`⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ⚠️\n\n📌 Karon: Gali / 18+ Kotha\n⚠️ Warning: ${count} bar\n\nTumi ${count} bar rules nosto korcho!\nGali bola nished!`, threadID, messageID);
  } catch (e) {
    console.log(e);
  }
};

module.exports.run = async function() {};
