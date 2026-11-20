module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "8.0.0",
  credits: "Muhammad Rifat Sheikh",
  description: "MIMU BOT Simple Welcome - Crazy Corner",
  dependencies: {
    "axios": "",
    "moment-timezone": "",
    "fs-extra": ""
  }
};

const axios = require("axios");

const VIP_UID = ["61596306493501"];

async function getAvatar(uid) {
  try {
    const avatar = await axios.get(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
      responseType: "stream"
    });
    return avatar.data;
  } catch (e) {
    return null;
  }
}

module.exports.run = async function ({ api, event, Users }) {
  try {
    const { threadID, author } = event;

    /* ============ BOT JOIN ============ */
    if (event.logMessageData.addedParticipants.some(u => u.userFbId == api.getCurrentUserID())) {
      const prefix = global.config.PREFIX || "/";
      return api.sendMessage(
`┌───🌸────🌷───┐
│👑 𝐌𝐈𝐌𝐔 𝐁𝐎𝐓 𝐇𝐄𝐑𝐄 ✨
└───🎀────🪄───┘

🎀 তোমাদের মধ্যে চলে এসেছি আমি
🎀 বিনোদন দিবো, কথা বলবো, মজা করবো

👑 𝐎𝐰𝐧𝐞𝐫 : Muhammad Rifat Sheikh

━━━━━━━━━━━━━━━━━━

💖 𝐋𝐄𝐓'𝐒 𝐇𝐀𝐕𝐄 𝐅𝐔𝐍 𝐓𝐎𝐆𝐄𝐓𝐇𝐄𝐑 💖`,
        threadID
      );
    }

    const addedUsers = event.logMessageData.addedParticipants;
    const mentions = addedUsers.map(u => ({ tag: u.fullName, id: u.userFbId }));
    const names = addedUsers.map(u => u.fullName);
    const isVIP = addedUsers.some(u => VIP_UID.includes(u.userFbId));

    const firstUser = addedUsers[0];
    let avatarStream = null;
    if (firstUser) avatarStream = await getAvatar(firstUser.userFbId);

    /* ============ VIP ============ */
    if (isVIP) {
      const msg = `┌───👑────💎───┐
│  𝐕𝐈𝐏 𝐀𝐑𝐑𝐈𝐕𝐀𝐋  │
└───🌟────✨───┘

💝 স্বাগতম জানাচ্ছি বিশেষ অতিথিকে!

👤 নাম : ${names.join(", ")}

❤️ ধন্যবাদ আমাদের সাথে থাকার জন্য!`;
      if (avatarStream) return api.sendMessage({ body: msg, mentions, attachment: avatarStream }, threadID);
      else return api.sendMessage({ body: msg, mentions }, threadID);
    }

    /* ============ NORMAL WELCOME - 6 NUMBER ============ */
    const msg = `Heyy 🌸
👤 নাম : ${names.join(", ")}

Welcome To Crazy Corner 💖
অনেক অনেক ভালোবাসা রইলো তোমার জন্য 🌹`;

    if (avatarStream) return api.sendMessage({ body: msg, mentions, attachment: avatarStream }, threadID);
    else return api.sendMessage({ body: msg, mentions }, threadID);

  } catch (e) {
    console.log("JoinNoti Error:", e);
  }
};
