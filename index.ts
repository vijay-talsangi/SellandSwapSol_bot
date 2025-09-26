import { Telegraf, Markup } from 'telegraf';
// import { message } from 'telegraf/filters';
import { PrismaClient } from './generated/prisma';
import { Keypair } from '@solana/web3.js';

const prismaClient = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

const DEFAULT_KEYBOARD = Markup.inlineKeyboard([
    Markup.button.callback("Show public key", "public_key"),
    Markup.button.callback("Show Private key", "private_key"),
]);

bot.start(async (ctx) => {
    const existingUser = await prismaClient.users.findFirst({
        where: { 
            tgUserId: ctx.chat.id.toString()
        }
    });
    
    if(existingUser){
        ctx.reply(`Welcome back to the SellandSwapSol Bot.`, {
            ...DEFAULT_KEYBOARD
        });

    } else {
        const keypair = Keypair.generate();
        await prismaClient.users.create({
            data: {
                tgUserId: ctx.chat.id.toString(),
                publicKey: keypair.publicKey.toBase58(),
                privateKey: keypair.secretKey.toBase64()
            }
        })
        const publicKey = keypair.publicKey.toString();
        ctx.reply(`Welcome to the SellandSwapSol Bot.
            You can trade on solana now, first put some sol here.`, {
            ...DEFAULT_KEYBOARD
        });
    }
});

bot.action("public_key", async (ctx) => {
    await ctx.answerCbQuery();
    const user = await prismaClient.users.findFirst({
        where: { 
            tgUserId: ctx.chat?.id.toString()
        }
    });
    return ctx.reply(
        `Your public key is ${user?.publicKey}`, {
            ...DEFAULT_KEYBOARD
        }
    );
});

bot.action("private_key", async (ctx) => {
    await ctx.answerCbQuery();
    const user = await prismaClient.users.findFirst({
        where: { 
            tgUserId: ctx.chat?.id.toString()
        }
    });
    return ctx.reply(
        `Your private key is ${user?.privateKey}`, {
            ...DEFAULT_KEYBOARD
        }
    );
});

bot.launch();