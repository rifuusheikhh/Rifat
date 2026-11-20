module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "7.1.0",
  credits: "Muhammad Rifat Sheikh",
  description: "Ultra Join System + VIP + Daily Report + 10 Frame Auto System - MIMU BOT",
  dependencies: {
    "axios": "",
    "moment-timezone": "",
    "fs-extra": ""
  }
};

const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");
const axios = require("axios");

const cooldown = {};
const VIP_UID = ["61596306493501"];

const filePath = path.join(__dirname, "cache", "dailyJoin.json");
const frameFile = path.join(__dirname, "cache", "frame.json");

function loadFrame() {
  if (!fs.existsSync(frameFile)) return {};
  return JSON.parse(fs.readFileSync(frameFile));
}
function saveFrame(data) {
  fs.writeFileSync(frameFile, JSON.stringify(data, null, 2));
}
function ensureFile() {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
}
function loadData() {
  ensureFile();
  return JSON.parse(fs.readFileSync(filePath));
}
function saveData(data) {
  ensureFile();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
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
    const today = moment.tz("Asia/Dhaka").format("DD-MM-YYYY");
    let data = loadData();
    let frameDB = loadFrame();
    if (!data[threadID]) data[threadID] = { date: today, count: 0 };
    if (!frameDB[threadID]) frameDB[threadID] = 1;
    if (data[threadID].date !== today) {
      data[threadID].date = today;
      data[threadID].count = 0;
    }

    if (!global.autoFrameIndex) global.autoFrameIndex = {};
    if (!global.autoFrameIndex[threadID]) {
      global.autoFrameIndex[threadID] = 1;
    } else {
      global.autoFrameIndex[threadID]++;
      if (global.autoFrameIndex[threadID] > 10) {
        global.autoFrameIndex[threadID] = 1;
      }
    }
    const frame = global.autoFrameIndex[threadID];

    if (event.logMessageData.addedParticipants.some(u => u.userFbId == api.getCurrentUserID())) {
      const prefix = global.config.PREFIX || "/";
      return api.sendMessage(
`┌───🌸────🌷───┐
│👑 𝐌𝐈𝐌𝐔 𝐁𝐎𝐓 𝐇𝐄𝐑𝐄 ✨
└───🎀────🪄───┘

🎀 তোমাদের মধ্যে চলে এসেছি আমি
🎀 বিনোদন দিবো, কথা বলবো, মজা করবো

💠 𝐏𝐫𝐞𝐟𝐢𝐱 : ${prefix}
👑 𝐎𝐰𝐧𝐞𝐫 : Muhammad Rifat Sheikh

━━━━━━━━━━━━━━━━━━

💖 𝐋𝐄𝐓'𝐒 𝐇𝐀𝐕𝐄 𝐅𝐔𝐍 𝐓𝐎𝐆𝐄𝐓𝐇𝐄𝐑 💖`,
        threadID
      );
    }

    // Cooldown 0 - sathe sathe asbe

    const addedUsers = event.logMessageData.addedParticipants;
    const mentions = addedUsers.map(u => ({ tag: u.fullName, id: u.userFbId }));
    const names = addedUsers.map(u => u.fullName);
    const count = addedUsers.length;
    const adderName = await Users.getNameUser(author);
    const isVIP = addedUsers.some(u => VIP_UID.includes(u.userFbId));

    data[threadID].count += count;
    saveData(data);

    const firstUser = addedUsers[0];
    let avatarStream = null;
    if (firstUser) avatarStream = await getAvatar(firstUser.userFbId);

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

    if (count >= 10) {
      const msg = `┌───🎉────🎊───┐
│  𝐁𝐈𝐆 𝐆𝐑𝐎𝐔𝐏  │
└───🎈────🎁───┘

👥 ${count} জন সদস্য যোগদান করেছেন
➕ যোগ করেছেন : ${adderName}

💝 সবাইকে আন্তরিক স্বাগতম!`;
      if (avatarStream) return api.sendMessage({ body: msg, mentions, attachment: avatarStream }, threadID);
      else return api.sendMessage({ body: msg, mentions }, threadID);
    }

    let msg = "";
    let welcomeText = "";
    const welcomeLine1 = "আসসালামুয়ালাইকুম।";
    const welcomeLine2 = "আপনাকে আমাদের Crazy Corner গ্রুপে Wlc🌹";

    if (frame === 1) {
      welcomeText = `🌸 স্বাগতম নতুন সদস্য 🌸`;
      msg = `┌───🌸────🌷───┐\n│  ${welcomeText}  │\n└───🎀────🪄───┘\n\n👤 নাম : ${names.join(", ")}\n👥 যোগদান : ${count} জন\n➕ যোগ করেছেন : ${adderName}\n\n${welcomeLine1}\n${welcomeLine2}`;
    }
    if (frame === 2) {
      welcomeText = `🌟 নতুন মুখের আগমন 🌟`;
      msg = `┌───🌟────⭐───┐\n│  ${welcomeText}  │\n└───✨────💫───┘\n\n👤 ${names.join(", ")}\n👥 +${count} জন যোগদান\n➕ ${adderName}\n\n${welcomeLine1}\n${welcomeLine2}`;
    }
    if (frame === 3) {
      welcomeText = `💫 নতুন যাত্রার শুরু 💫`;
      msg = `┌───💫────🌠───┐\n│  ${welcomeText}  │\n└───🌟────⭐───┘\n\n👤 নাম : ${names.join(", ")}\n👥 যোগদান : ${count} জন\n➕ যোগ করেছেন : ${adderName}\n\n${welcomeLine1}\n${welcomeLine2}`;
    }
    if (frame === 4) {
      welcomeText = `🌺 নতুন বন্ধুর আগমন 🌺`;
      msg = `┌───🌺────🌸───┐\n│  ${welcomeText}  │\n└───🌷────🌹───┘\n\n👤 ${names.join(", ")}\n👥 +${count} জন যোগদান\n➕ ${adderName}\n\n${welcomeLine1}\n${welcomeLine2}`;
    }
    if (frame === 5) {
      welcomeText = `✨ নতুন আশার আলো ✨`;
      msg = `┌───✨────🌟───┐\n│  ${welcomeText}  │\n└───⭐────💫───┘\n\n👤 নাম : ${names.join(", ")}\n👥 যোগদান : ${count} জন\n➕ যোগ করেছেন : ${adderName}\n\n${welcomeLine1}\n${welcomeLine2}`;
    }
    if (frame === 6) {
      welcomeText = `💎 নতুন সম্ভাবনার শুরু 💎`;
      msg = `┌───💎────💠───┐\n│  ${welcomeText}  │\n└───🔮────💡───┘\n\n👤 ${names.join(", ")}\n👥 +${count} জন যোগদান\n➕ ${adderName}\n\n${welcomeLine1}\n${welcomeLine2}`;
    }
    if (frame === 7) {
      welcomeText = `🎊 নতুন সদস্যকে অভিনন্দন 🎊`;
      msg = `┌───🎊────🎉───┐\n│  ${welcomeText}  │\n└───🎁────🎈───┘\n\n👤 নাম : ${names.join(", ")}\n👥 যোগদান : ${count} জন\n➕ যোগ করেছেন : ${adderName}\n\n${welcomeLine1}\n${welcomeLine2}`;
    }
    if (frame === 8) {
      welcomeText = `🌷 নতুন প্রাণের স্পন্দন 🌷`;
      msg = `┌───🌷────🌹───┐\n│  ${welcomeText}  │\n└───🌸────🌺───┘\n\n👤 ${names.join(", ")}\n👥 +${count} জন যোগদান\n➕ ${adderName}\n\n${welcomeLine1}\n${welcomeLine2}`;
    }
    if (frame === 9) {
      welcomeText = `⭐ নতুন স্বপ্নের শুরু ⭐`;
      msg = `┌───⭐────🌟───┐\n│  ${welcomeText}  │\n└───✨────💫───┘\n\n👤 নাম : ${names.join(", ")}\n👥 যোগদান : ${count} জন\n➕ যোগ করেছেন : ${adderName}\n\n${welcomeLine1}\n${welcomeLine2}`;
    }
    if (frame === 10) {
      welcomeText = `🌈 নতুন রঙের সমাহার 🌈`;
      msg = `┌───🌈────🎨───┐\n│  ${welcomeText}  │\n└───💜────🧡───┘\n\n👤 ${names.join(", ")}\n👥 +${count} জন যোগদান\n➕ ${adderName}\n\n${welcomeLine1}\n${welcomeLine2}`;
    }

    if (avatarStream) return api.sendMessage({ body: msg, mentions, attachment: avatarStream }, threadID);
    else return api.sendMessage({ body: msg, mentions }, threadID);

  } catch (e) {
    console.log("JoinNoti Error:", e);
  }
};
