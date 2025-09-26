import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!)

bot.start((ctx) => {
    ctx.reply('Welcome to the SellandSwapSol Bot')
})
bot.launch()