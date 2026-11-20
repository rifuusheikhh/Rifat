const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "anti18",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Rifat",
  description: "Gali warning with count + profile pic, no kick",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;
  if (senderID == api.getCurrentUserID()) return;

  const text = body.toLowerCase();

  const badWords = [
    "fuck", "fucking", "fucker", "bitch", "shit", "porn", "sex", "sexy", "xxx", "nude", "naked", "pussy", "dick", "cock", "penis", "vagina", "boobs", "breast", "asshole", "motherfucker", "bastard", "suck", "blowjob", "horny", "kiss", "lick", "fuk", "s3x", "pornhub", "xvideos", "xnxx",
    "chud", "chod", "choda", "chodon", "chudir", "chudna", "chudlam", "magi", "khanki", "khankir", "khankir pola", "bainchod", "bainchot", "madarchod", "madarchot", "randi", "chutiya", "chutmarani", "bal", "balsal", "heda", "kutta", "kuttar", "shuar", "shuyorer", "harami", "haramjada", "bejonma", "tor mai", "tor mar", "tor bon", "tor maa", "tor ma", "tor bap", "ma re chudi", "hoga", "hogar", "poda", "pod", "gud", "mut", "muta", "hag", "lagabo", "dhukabo", "vorbo", "chudbo", "mal", "maal", "ros",
    "চুদ", "চোদ", "চুদির", "মাগি", "খানকি", "খানকির", "বাইনচোদ", "বাইনচোত", "মাদারচোদ", "রান্ডি", "চুতিয়া", "বাল", "হেডা", "কুত্তা", "শুয়োর", "হারামি", "হারামজাদা", "তোর মা", "তোর বোন", "তোর বাপ", "পোদ", "হোগা", "গুদ", "চুদবো", "লাগাবো", "মাল",
    "bhenchod", "behenchod", "gandu", "lund", "gaand", "bhosdi", "bhosdike", "bhosdiwala", "chut", "lauda", "mc", "bc", "kamine", "harami"
  ];

  const badPhrases = ["i love you", "kiss me", "hot pic", "nude pic", "send nude", "toke chudbo", "toke lagabo", "size koto", "boobs dekha", "18+ video", "hot lagtese", "sexy lagtese", "amar sathe suye", "amar sathe ghumabi"];
  const badEmojis = ["👄", "🫦", "👅", "💋", "🥵", "🍆", "🍑", "💦", "👙", "🩲", "🍒", "🌶️", "😈", "😏", "🤤", "😘", "💏", "👉👌", "🍌", "🥒"];

  const isGali = badWords.some(w => text.includes(w));
  const isPhrase = badPhrases.some(p => text.includes(p));
  const isEmoji = badEmojis.some(e => body.includes(e));
  if (!isGali && !isPhrase && !isEmoji) return;

  // ===== WARNING COUNT - KICK HOBE NA, SUDHU BARBE =====
  const warnPath = path.join(__dirname, "cache", "anti18_warn.json");
  await fs.ensureDir(path.join(__dirname, "cache"));
  let warnData = {};
  try { if (await fs.pathExists(warnPath)) warnData = await fs.readJson(warnPath); } catch (e) {}

  const key = `${threadID}_${senderID}`;
  warnData[key] = (warnData[key] || 0) + 1;
  await fs.writeJson(warnPath, warnData);
  const count = warnData[key];

  let reason = "Gali / 18+ Kotha";
  if (isEmoji) reason = "18+ Emoji";
  if (isPhrase) reason = "18+ Kotha";

  // ===== PROFILE PIC - WELCOME ER MOTO =====
  let attachment = null;
  let name = "User";
  try {
    const info = await api.getUserInfo(senderID);
    const user = info[senderID];
    name = user?.name || "User";
    if (user?.thumbSrc) {
      const filePath = path.join(__dirname, "cache", `anti18_${senderID}.jpg`);
      const res = await axios.get(user.thumbSrc, { responseType: "arraybuffer" });
      await fs.writeFile(filePath, Buffer.from(res.data, "binary"));
      attachment = fs.createReadStream(filePath);
    }
  } catch (e) {}

  return api.sendMessage({
    body: `━━━━━━━━━━━━━━━━━━━━\n⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ⚠️\n━━━━━━━━━━━━━━━━━━━━\n\n👤 Name: ${name}\n📌 Karon: ${reason}\n⚠️ Warning: ${count} bar\n\nTumi ${count} bar rules nosto korcho!\nGali / 18+ kotha / 18+ emoji bola ekhane nished!\n\nDoya kore valo vabe kotha bolo.\n\n- Powered By Rifat\n━━━━━━━━━━━━━━━━━━━━`,
    mentions: [{ tag: name, id: senderID }],
    attachment: attachment ? [attachment] : []
  }, threadID, messageID);
};

module.exports.run = async function() {};
