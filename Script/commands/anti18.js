module.exports.config = {
  name: "anti18",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rifat",
  description: "18+ bolle warning",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;
  if (senderID == api.getCurrentUserID()) return;

  const text = body.toLowerCase();
  const badWords = ["fuck", "sex", "xxx", "porn", "chud", "magi", "khanki", "chod", "bitch", "shit"];

  if (!badWords.some(w => text.includes(w))) return;

  return api.sendMessage({
    body: `⚠️ WARNING ⚠️\n\n18+ / baje kotha bola nished! Abar bolle kick khaba.`,
    mentions: [{ tag: "user", id: senderID }]
  }, threadID, messageID);
};

module.exports.run = async function() {};
