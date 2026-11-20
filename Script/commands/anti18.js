const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "anti18",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Rifat",
  description: "Full Gali + 18+ + Emoji warning with profile pic",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;
  if (senderID == api.getCurrentUserID()) return;

  const text = body.toLowerCase();

  // ========== FULL GALI A TO Z ==========
  const badWords = [
    // English 18+ / Gali
    "fuck", "fucking", "fucker", "bitch", "shit", "porn", "sex", "sexy", "xxx", "nude", "naked", "pussy", "dick", "cock", "penis", "vagina", "boobs", "breast", "asshole", "ass", "motherfucker", "bastard", "suck", "blowjob", "handjob", "horny", "kiss", "lick", "fucked", "fuk", "s3x", "pornhub", "xvideos", "xnxx",
    // Bangla Roman
    "chud", "chod", "choda", "chodon", "chudir", "chudna", "chudlam", "magi", "khanki", "khankir", "khankir pola", "khankir pula", "bainchod", "bainchot", "madarchod", "madarchot", "randi", "chutiya", "chutmarani", "bal", "balsal", "baler", "heda", "kutta", "kuttar", "kuttar baccha", "shuar", "shuyorer", "shuyorer baccha", "harami", "haramjada", "bejonma", "bejorma", "tor mai", "tor mar", "tor bon", "tor maa", "tor ma", "tor bap", "ma re chudi", "bap re chudi", "tui chud", "hoga", "hogar", "poda", "pod", "podmara", "gud", "gu", "mut", "muta", "hag", "haga", "hagu", "peshab", "chodna", "chudbo", "chudbo toke", "lagabo", "dhukabo", "vorbo", "khara", "mal", "maal", "ros", "fata", "fatabo",
    // Bangla Bangla
    "চুদ", "চোদ", "চুদির", "মাগি", "খানকি", "খানকির", "বাইনচোদ", "বাইনচোত", "মাদারচোদ", "রান্ডি", "চুতিয়া", "বাল", "হেডা", "কুত্তা", "শুয়োর", "হারামি", "হারামজাদা", "তোর মা", "তোর বোন", "তোর বাপ", "পোদ", "হোগা", "গুদ", "চুদবো", "লাগাবো", "মাল", "রস",
    // Hindi / Urdu Gali
    "bhenchod", "behenchod", "chutiya", "gandu", "lund", "gaand", "bhosdi", "bhosdike", "bhosdiwala", "chut", "lauda", "loda", "mc", "bc", "chinal", "randi", "kutta", "kamine", "harami", "madarchod"
  ];

  // ========== 18+ KOTHA / PHRASE ==========
  const badPhrases = [
    "i love you", "i want you", "kiss me", "hot pic", "nude pic", "send nude", "video call sex", "voice call sex", "amar sathe suye", "amar sathe ghumabi", "toke chudbo", "toke lagabo", "size koto", "dudh koto boro", "boobs dekha", "pic dekhbi", "18+ video", "link dao", "x video", "hot lagtese", "sexy lagtese"
  ];

  // ========== 18+ EMOJI ==========
  const badEmojis = [
    "👄", "🫦", "👅", "💋", "🥵", "🍆", "🍑", "💦", "👙", "🩲", "🍒", "🌶️", "🔥", "😈", "😏", "🤤", "👉👌", "🍌", "🥒", "🍩", "🍔", "👅💦", "😘", "💏", "👩‍❤️‍💋‍👨"
  ];

  const isGali = badWords.some(w => text.includes(w));
  const isPhrase = badPhrases.some(p => text.includes(p));
  const isEmoji = badEmojis.some(e => body.includes(e));

  if (!isGali && !isPhrase && !isEmoji) return;

  // ===== PROFILE PIC ANA =====
  let attachment = null;
  try {
    const info = await api.getUserInfo(senderID);
    const user = info[senderID];
    const name = user?.name || "User";
    const avatarUrl = user?.thumbSrc;

    if (avatarUrl) {
      const filePath = path.join(__dirname, "cache", `anti18_${senderID}.jpg`);
      await fs.ensureDir(path.join(__dirname, "cache"));
      const res = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      await fs.writeFile(filePath, Buffer.from(res.data, "binary"));
      attachment = fs.createReadStream(filePath);
    }

    let reason = "Gali / 18+ kotha";
    if (isEmoji) reason = "18+ Emoji";
    if (isPhrase) reason = "18+ Kotha";

    return api.sendMessage({
      body: `⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ⚠️\n\n👤 Name: ${name}\n📌 Karone: ${reason}\n\nGali / 18+ kotha / 18+ emoji bola ekhane nished!\nAbar bolle mute / kick khaba.\n\n- Powered By Rifat`,
      mentions: [{ tag: name, id: senderID }],
      attachment: attachment ? [attachment] : []
    }, threadID, messageID);

  } catch (e) {
    return api.sendMessage({
      body: `⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ⚠️\n\nGali / 18+ kotha bola nished! Abar bolle kick khaba.`,
      mentions: [{ tag: "user", id: senderID }]
    }, threadID, messageID);
  }
};

module.exports.run = async function() {};
