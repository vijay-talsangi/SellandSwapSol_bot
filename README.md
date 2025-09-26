# Solana Telegram Trading Bot

A Telegram bot for Solana trading with wallet management functionality.

## Features

- 🔑 Automatic wallet generation for new users
- 💰 Real-time balance checking
- 🔐 Secure private key management
- 📊 User data persistence with PostgreSQL

## Setup

### Prerequisites

- [Bun](https://bun.sh/) runtime
- PostgreSQL database
- Telegram Bot Token (get from [@BotFather](https://t.me/botfather))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solana-tg-bot
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
RPC_URL=https://api.mainnet-beta.solana.com
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

5. Set up the database:
```bash
bunx prisma migrate dev
```

6. Start the bot:
```bash
bun run index.ts
```

## Commands

- `/start` - Initialize the bot and create a new wallet
- `🔑 Show public key` - Display your wallet's public key and balance
- `🔐 Show Private key` - Display your wallet's private key (⚠️ keep secure!)

## Security Notes

- Never share your private key with anyone
- Use testnet/devnet for development
- Consider using environment-specific configurations
- Regular backup of your database

## Development

To generate Prisma client after schema changes:
```bash
bunx prisma generate
```

To reset the database:
```bash
bunx prisma migrate reset
```
