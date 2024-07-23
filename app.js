import { default as baileys } from "@whiskeysockets/baileys";
const { makeWASocket, DisconnectReason, useMultiFileAuthState } = baileys;
import pino from "pino";
import { parseUnixTime } from "./helper/dayjs.js";
import chalk from "chalk";
// import { Boom } from "@hapi/boom";

async function RenzTopupBotStart() {
  const { state, saveCreds } = await useMultiFileAuthState(`auth_info_baileys`);

  // initiate and add configuration for WA Socket
  const socket = makeWASocket({
    printQRInTerminal: true,
    browser: ["Renz Bot Topup ", "", ""],
    auth: state,
    logger: pino({ level: "silent" }),
  });

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    console.log("🚀 ~ file: app.js:21 ~ socket.ev.on ~ update:", update);
    if (connection === "close") {
      console.log(
        "🚀 ~ file: app.js:24 ~ socket.ev.on ~ lastDisconnect, DisconnectReason:",
        lastDisconnect,
        DisconnectReason
      );
    } else if (connection === "open") {
      console.log(
        "🚀 ~ file: app.js:30 ~ socket.ev.on ~ Connection Start, Bot Ready!!!"
      );
    }
  });

  socket.ev.on("messages.upsert", async (response) => {
    try {
      const responseType = response.type;
      console.log(
        "🚀 ~ file: app.js:40 ~ socket.ev.on ~ responseType:",
        responseType
      );
      if (responseType === "append") return;
      const data = response.messages[0];
      console.log("🚀 ~ file: app.js:38 ~ socket.ev.on ~ data:", data);
      const key = data.key;
      const remoteJid = key.remoteJid;
      const messageId = key.id;
      const dateTime = parseUnixTime(data.messageTimestamp);
      const custName = data.pushName;
      let message = "";
      if (data.message.conversation) {
        message = data.message.conversation;
      }
      if (data.message.extendedTextMessage) {
        message = data.message.extendedTextMessage.text;
      }

      console.log("🚀 ~ file: app.js:47 ~ socket.ev.on ~ message:", message);

      if (!!message && responseType === "notify") {
        const text = `Hallo ${custName},
remoteJid : ${remoteJid},
messageId : ${messageId},
dateTime : ${dateTime},
yourMessage : ${message}`;

        await socket.sendMessage(remoteJid, {
          text,
        });
        console.log(chalk.bgBlue("successfully replying to", remoteJid));
      }

      // console.log(JSON.stringify((m, undefined, 2)));

      // console.log("replying to", m.messages[0].key.remoteJid);
      // await socket.sendMessage(m.messages[0].key.remoteJid, {
      //   text: "Hello there",
      // });
    } catch (err) {
      console.log("🚀 ~ file: app.js:75 ~ socket.ev.on ~ err:", err);
    }
  });
}
RenzTopupBotStart();
