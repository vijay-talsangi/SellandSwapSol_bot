import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const connection = new Connection(process.env.RPC_URL!);

export async function getBalanceMessage(publicKey: string): Promise<{
    empty: boolean,
    message: string
}> {
    try {
        const balance = await connection.getBalance(new PublicKey(publicKey));
        const solBalance = balance / LAMPORTS_PER_SOL;
        
        if (balance > 0) {
            return { 
                empty: false, 
                message: `💰 Your balance: ${solBalance.toFixed(4)} SOL` 
            };
        } else {
            return { 
                empty: true, 
                message: "💸 Your wallet is empty" 
            };
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
        return { 
            empty: true, 
            message: "❌ Failed to fetch balance. Please check your wallet." 
        };
    }
}