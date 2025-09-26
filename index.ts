import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { PrismaClient } from './generated/prisma';
import { Keypair } from '@solana/web3.js';

const prismaClient = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.start(async (ctx) => {
    const existingUser = await prismaClient.users.findFirst({
        where: { 
            tgUserId: ctx.chat.id.toString()
        }
    });
    
    if(existingUser){
        const publicKey = existingUser.publicKey;
        ctx.reply(`Welcome to the SellandSwapSol Bot. Here is your public key: ${publicKey}`);

    } else {
        const keypair = Keypair.generate();
        await prismaClient.users.create({
            data: {
                tgUserId: ctx.chat.id.toString(),
                publicKey: keypair.publicKey.toBase58(),
                privateKey: keypair.secretKey.toString()
            }
        })
        const publicKey = keypair.publicKey.toString();
        ctx.reply(`Welcome to the SellandSwapSol Bot. Here is your public key: ${publicKey}
        You can trade on solana now, first put some sol here.`);
    }
});
bot.launch();