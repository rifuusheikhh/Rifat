module.exports.config = {
  name: "anti18",
  eventType: ["message"],
  version: "1.0.0",
  credits: "Rifat",
  description: "18+ kotha bolle warning dibe"
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;

  // Bot nijer message e react korbe na
  if (senderID == api.getCurrentUserID()) return;

  const text = body.toLowerCase();

  const badWords = [
    "fuck", "bitch", "shit", "porn", "sex", "xxx", "nude",
    "chud", "chod", "magi", "khanki", "bal", "bainchod",
    "madarchod", "randi", "chodon", "pussy", "dick", "boobs"
  ];

  const found = badWords.find(w => text.includes(w));
  if (!found) return;

  // Message delete korar try korbe (bot admin hole)
  try { api.unsendMessage(messageID); } catch (e) {}

  return api.sendMessage(
`⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ⚠️

@user, 18+ / baje kotha bola ekhane nished!
Abar bolle mute / kick khaba.

- Powered By Rifat`,
    threadID, (err, info) => {
      // mention dewar jonno
    }, messageID
  );
};
