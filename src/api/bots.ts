import { BotData, BotCreateRequest, BotUpdateRequest } from '../types/apiTypes';
import {validateToken} from './auth';
import {delay} from "../helpers/delay";

let bots: BotData[] = [
    {
        id: '1',
        name: 'BTC Grid Bot',
        status: 'ACTIVE',
        symbol: 'BTCUSDT',
        deposit: 5000,
        profit_percentage: 0.8,
        num_orders: 10,
        grid_length: 5
    },
    {
        id: '2',
        name: 'ETH Scalper',
        status: 'PAUSE',
        symbol: 'ETHUSDT',
        deposit: 3000,
        profit_percentage: 1.2,
        num_orders: 8,
        grid_length: 7
    }
];

export const fetchBots = async (token: string | null): Promise<BotData[]> => {
    await delay(500);

    if (!validateToken(token)) {
        throw new Error('Invalid or expired token');
    }

    return [...bots];
};

export const createBot = async (bot: BotCreateRequest, token: string | null): Promise<BotData> => {
    await delay(500);

    if (!validateToken(token)) {
        throw new Error('Invalid or expired token');
    }

    const newBot: BotData = {
        ...bot,
        id: Date.now().toString(),
        status: 'ACTIVE'
    };

    bots.push(newBot);
    return newBot;
};

export const updateBot = async (bot: BotUpdateRequest, token: string | null): Promise<BotData> => {
    await delay(500);

    if (!validateToken(token)) {
        throw new Error('Invalid or expired token');
    }

    const index = bots.findIndex(b => b.id === bot.id);

    if (index === -1) {
        throw new Error('Bot not found');
    }

    const updatedBot = {
        ...bots[index],
        ...bot
    };

    bots[index] = updatedBot;
    return updatedBot;
};
