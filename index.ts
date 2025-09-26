import { Telegraf, Markup } from 'telegraf';
import { PrismaClient } from './generated/prisma';
import { Keypair } from '@solana/web3.js';
import { getBalanceMessage } from './solana';

if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
}

if (!process.env.RPC_URL) {
    throw new Error('RPC_URL environment variable is required');
}

const prismaClient = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const DEFAULT_KEYBOARD = Markup.inlineKeyboard([
    Markup.button.callback("🔑 Show public key", "public_key"),
    Markup.button.callback("🔐 Show Private key", "private_key"),
]);

async function getUserByTgId(tgUserId: string) {
    return await prismaClient.users.findFirst({
        where: { tgUserId }
    });
}

bot.start(async (ctx) => {
    try {
        const tgUserId = ctx.chat.id.toString();
        
        const existingUser = await getUserByTgId(tgUserId);
        
        if (existingUser) {
            const { empty: isEmpty, message } = await getBalanceMessage(existingUser.publicKey);
            
            await ctx.reply(
                `Welcome back to the SellandSwapSol Bot.${isEmpty ? "\nYour wallet is empty please fund it to trade on SOL" : `\n${message}`}`, 
                { ...DEFAULT_KEYBOARD }
            );
        } else {
            const keypair = Keypair.generate();

            await prismaClient.users.create({
                data: {
                    tgUserId,
                    publicKey: keypair.publicKey.toBase58(),
                    privateKey: Buffer.from(keypair.secretKey).toString('base64')
                }
            });

            await ctx.reply(
                `Welcome to the SellandSwapSol Bot.\nYou can trade on solana now, first put some sol here.`, 
                { ...DEFAULT_KEYBOARD }
            );
        }
    } catch (error) {
        console.error('Error in start command:', error);
        await ctx.reply('Sorry, something went wrong. Please try again later.');
    }
});

bot.action("public_key", async (ctx) => {
    try {
        await ctx.answerCbQuery();

        if (!ctx.chat?.id) {
            await ctx.reply('Unable to identify user. Please restart the bot with /start');
            return;
        }

        const user = await getUserByTgId(ctx.chat.id.toString());

        if (!user) {
            await ctx.reply('User not found. Please restart the bot with /start');
            return;
        }

        const { empty: isEmpty, message } = await getBalanceMessage(user.publicKey);

        await ctx.reply(
            `🔑 Your public key is:\n\`${user.publicKey}\`${isEmpty ? "\n\n💡 Fund your wallet first to start trading" : `\n\n${message}`}`, 
            { 
                ...DEFAULT_KEYBOARD,
                parse_mode: 'Markdown'
            }
        );
    } catch (error) {
        console.error('Error in public_key action:', error);
        await ctx.answerCbQuery('Error occurred');
        await ctx.reply('Sorry, something went wrong. Please try again.');
    }
});

bot.action("private_key", async (ctx) => {
    try {
        await ctx.answerCbQuery();

        if (!ctx.chat?.id) {
            await ctx.reply('Unable to identify user. Please restart the bot with /start');
            return;
        }

        const user = await getUserByTgId(ctx.chat.id.toString());

        if (!user) {
            await ctx.reply('User not found. Please restart the bot with /start');
            return;
        }

        await ctx.reply(
            `🔐 *SECURITY WARNING*: Never share your private key with anyone!\n\nYour private key is:\n\`${user.privateKey}\`\n\n🔒 Keep this safe and secure!`, 
            { 
                ...DEFAULT_KEYBOARD,
                parse_mode: 'Markdown'
            }
        );
    } catch (error) {
        console.error('Error in private_key action:', error);
        await ctx.answerCbQuery('Error occurred');
        await ctx.reply('Sorry, something went wrong. Please try again.');
    }
});

bot.catch((err: any, ctx: any) => {
    console.error('Bot error:', err);
    ctx.reply('An unexpected error occurred. Please try again.');
});

bot.launch()
    .then(() => {
        console.log('🚀 Bot started successfully');
    })
    .catch((error) => {
        console.error('Failed to start bot:', error);
        process.exit(1);
    });

process.once('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    bot.stop('SIGINT');
    prismaClient.$disconnect();
});

process.once('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    bot.stop('SIGTERM');
    prismaClient.$disconnect();
});