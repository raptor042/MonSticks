import { Telegraf } from "telegraf";
import { addUser, getUser } from "./database.js";
import shortUUID from "short-uuid"
import { botToken } from "./constants.js";
import { configDotenv } from "dotenv";

configDotenv()

const webAppUrl = process.env.WEB_APP_URL // "https://192.168.47.230:5173/"
// console.log(webAppUrl)

const welcomeMsg = `Hey, @username! Welcome to TapSwap!
Tap on the coin and see your balance rise.

TapSwap is a cutting-edge financial platform where users can earn tokens by leveraging the mining app's various features. The majority of TapSwap Token (TAPS) distribution will occur among the players here.

Do you have friends, relatives, or co-workers?
Bring them all into the game.
More buddies, more coins.`



export const bot = new Telegraf(botToken)

bot.start((ctx) => {
  const username  = ctx.chat.username
  console.log("Start command")
  const user = getUser(ctx.chat.id)
  if(!user){
    addUser(ctx.chat.id, shortUUID.generate(), null)
  }

  const msg = welcomeMsg.replace("username", username)
  // const msg = 
    const inlineKeyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🤟 Start now!',
                web_app: {
                  url: webAppUrl
                }
              }
            ]
          ]
        }
      };

    ctx.reply(msg, inlineKeyboard)

})

bot.launch()
// console.log("Launched")